"""
原型页面生成脚本
根据页面需求生成单个HTML原型文件（全屏布局 + 浮动按钮 + 需求说明抽屉）

用法:
    python generate_page.py --config <json_config_path>
    python generate_page.py --input '{"page_name": "...", "page_type": "...", ...}'
"""

import argparse
import json
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional
import re


COLORS = {
    'primary': '#1890ff',
    'success': '#52c41a',
    'warning': '#faad14',
    'error': '#f5222d',
}


def generate_drawer_styles() -> str:
    return '''
    .fab-btn {
      position: fixed; bottom: 32px; right: 32px;
      width: 48px; height: 48px; border-radius: 50%;
      background: #1890ff; color: #fff; border: none; cursor: pointer;
      box-shadow: 0 4px 12px rgba(24,144,255,0.4);
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; z-index: 999; transition: all 0.3s;
    }
    .fab-btn:hover { transform: scale(1.1); box-shadow: 0 6px 16px rgba(24,144,255,0.5); }

    .drawer-mask {
      position: fixed; inset: 0; background: rgba(0,0,0,0.45);
      z-index: 1000; opacity: 0; visibility: hidden; transition: all 0.3s;
    }
    .drawer-mask.visible { opacity: 1; visibility: visible; }

    .drawer-panel {
      position: fixed; top: 0; right: 0; width: 520px; height: 100vh;
      background: #fff; z-index: 1001;
      box-shadow: -6px 0 16px rgba(0,0,0,0.08);
      transform: translateX(100%); transition: transform 0.3s ease;
      display: flex; flex-direction: column;
    }
    .drawer-panel.open { transform: translateX(0); }

    .drawer-header {
      padding: 16px 24px; border-bottom: 1px solid #f0f0f0;
      display: flex; justify-content: space-between; align-items: center;
    }
    .drawer-body { flex: 1; padding: 24px; overflow-y: auto; }

    .doc-section { background: #fafafa; border-radius: 8px; padding: 20px; margin-bottom: 16px; }
    .doc-title { font-size: 15px; font-weight: 600; color: rgba(0,0,0,0.85); margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f0f0f0; }
    .doc-item { display: flex; gap: 12px; margin-bottom: 10px; font-size: 14px; line-height: 1.6; }
    .doc-label { font-weight: 500; color: rgba(0,0,0,0.65); min-width: 90px; flex-shrink: 0; }
    .doc-content { color: rgba(0,0,0,0.45); }
'''


def generate_base_html(title: str, prototype_content: str, description_content: str) -> str:
    drawer_styles = generate_drawer_styles()
    return f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>原型 - {title}</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/4.24.15/antd.min.css">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>{drawer_styles}
  </style>
</head>
<body>
  <!-- 原型页面（全屏展示） -->
{prototype_content}

  <!-- 浮动按钮（右下角） -->
  <button class="fab-btn" onclick="toggleDrawer()" title="查看需求说明">📋</button>

  <!-- 需求说明抽屉 -->
  <div class="drawer-mask" id="drawerMask" onclick="toggleDrawer()"></div>
  <div class="drawer-panel" id="drawerPanel">
    <div class="drawer-header">
      <h3 style="font-size: 16px; font-weight: 600; margin: 0;">{title} - 需求说明</h3>
      <button style="background: none; border: none; cursor: pointer; font-size: 16px; color: rgba(0,0,0,0.45);" onclick="toggleDrawer()">✕</button>
    </div>
    <div class="drawer-body">
{description_content}
    </div>
  </div>

  <script>
    function toggleDrawer() {{
      document.getElementById('drawerMask').classList.toggle('visible');
      document.getElementById('drawerPanel').classList.toggle('open');
    }}

    function mockAction(action, data) {{
      console.log('[Mock]', action, data);
      showMessage(action + ' 成功');
    }}

    function showMessage(text) {{
      var msg = document.createElement('div');
      msg.style.cssText = 'position:fixed;top:24px;left:50%;transform:translateX(-50%);padding:8px 16px;background:#f6ffed;border:1px solid #b7eb8f;border-radius:4px;color:#52c41a;font-size:14px;z-index:9999;transition:opacity 0.3s;';
      msg.textContent = '✓ ' + text;
      document.body.appendChild(msg);
      setTimeout(function() {{
        msg.style.opacity = '0';
        setTimeout(function() {{ msg.remove(); }}, 300);
      }}, 2000);
    }}
  </script>
</body>
</html>'''


MOCK_NAMES = ['张伟', '李娜', '王磊', '赵敏', '陈浩', '刘洋', '孙静', '周杰', '吴芳', '郑强']
MOCK_EMAILS = [f'{n}@company.com' for n in ['zhangwei', 'lina', 'wanglei', 'zhaomin', 'chenhao', 'liuyang', 'sunjing', 'zhoujie', 'wufang', 'zhengqiang']]
MOCK_DATES = ['2024-01-15 09:30', '2024-02-20 14:15', '2024-03-01 10:45', '2024-03-10 16:20', '2024-03-25 08:00']


def generate_list_page(config: Dict) -> str:
    data = config.get('data', {})
    interactions = config.get('interactions', {})
    page_name = config.get('page_name', '列表页')

    columns = data.get('columns', [])
    buttons = interactions.get('buttons', [])

    th_html = ''
    for col in columns:
        th_html += f'              <th class="ant-table-cell" style="padding: 12px 16px;">{col["title"]}</th>\n'

    tbody_html = ''
    for i in range(5):
        tbody_html += '            <tr class="ant-table-row">\n'
        for col in columns:
            if col.get('type') == 'tag':
                statuses = [('启用', 'ant-tag-success'), ('禁用', 'ant-tag-error'), ('待审核', 'ant-tag-warning')]
                status, tag_cls = statuses[i % 3]
                value = f'<span class="ant-tag {tag_cls}">{status}</span>'
            elif col.get('type') == 'actions':
                value = ('<a style="color: #1890ff; cursor: pointer;" onclick="mockAction(\'编辑\')">编辑</a>'
                         '<span style="margin: 0 8px; color: #d9d9d9;">|</span>'
                         '<a style="color: #1890ff; cursor: pointer;" onclick="mockAction(\'详情\')">详情</a>'
                         '<span style="margin: 0 8px; color: #d9d9d9;">|</span>'
                         '<a style="color: #ff4d4f; cursor: pointer;" onclick="mockAction(\'删除\')">删除</a>')
            elif col.get('type') == 'date':
                value = f'<span style="color: rgba(0,0,0,0.45);">{MOCK_DATES[i % len(MOCK_DATES)]}</span>'
            elif col.get('type') == 'name':
                value = MOCK_NAMES[i % len(MOCK_NAMES)]
            elif col.get('type') == 'email':
                value = MOCK_EMAILS[i % len(MOCK_EMAILS)]
            else:
                value = f'{col.get("title", "")}数据{i+1}'
            tbody_html += f'              <td class="ant-table-cell" style="padding: 12px 16px;">{value}</td>\n'
        tbody_html += '            </tr>\n'

    actions_html = ''
    for btn in buttons:
        btn_class = 'ant-btn-primary' if btn in ['新增', '创建', '添加'] else ''
        actions_html += f'        <button class="ant-btn {btn_class}" style="margin-right: 8px;" onclick="mockAction(\'{btn}\')">{btn}</button>\n'

    search_html = '<div style="display: flex; gap: 16px; flex-wrap: wrap; align-items: center;">\n'
    for col in columns[:3]:
        if col.get('type') not in ('actions', 'tag'):
            search_html += f'        <input class="ant-input" placeholder="{col["title"]}" style="width: 200px;">\n'
    search_html += '        <button class="ant-btn ant-btn-primary" onclick="mockAction(\'搜索\')">搜索</button>\n'
    search_html += '        <button class="ant-btn" onclick="mockAction(\'重置\')">重置</button>\n'
    search_html += '      </div>'

    return f'''  <div class="ant-layout" style="min-height: 100vh;">
    <header class="ant-layout-header" style="background: #fff; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 1px 4px rgba(0,21,41,0.08); height: 64px;">
      <div style="display: flex; align-items: center; gap: 16px;">
        <div style="width: 32px; height: 32px; background: #1890ff; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold;">S</div>
        <span style="font-size: 18px; font-weight: 500; color: rgba(0,0,0,0.85);">系统后台</span>
      </div>
      <div style="display: flex; align-items: center; gap: 16px;">
        <span style="color: rgba(0,0,0,0.65);">管理员</span>
        <div style="width: 32px; height: 32px; background: #f0f0f0; border-radius: 50%;"></div>
      </div>
    </header>

    <div style="display: flex; flex: 1;">
      <aside style="background: #001529; width: 200px; flex-shrink: 0;">
        <ul class="ant-menu ant-menu-dark ant-menu-root" style="background: #001529; padding: 16px 0;">
          <li class="ant-menu-item" style="padding-left: 24px; color: rgba(255,255,255,0.65);">
            <span>🏠</span><span style="margin-left: 10px;">首页</span>
          </li>
          <li class="ant-menu-item ant-menu-item-selected" style="background: #1890ff; padding-left: 24px;">
            <span>📋</span><span style="margin-left: 10px;">{page_name}</span>
          </li>
        </ul>
      </aside>

      <main style="flex: 1; padding: 24px; background: #f0f2f5; overflow: auto;">
        <div class="ant-breadcrumb" style="margin-bottom: 16px;">
          <span style="color: rgba(0,0,0,0.45);">首页</span>
          <span class="ant-breadcrumb-separator">/</span>
          <span style="color: rgba(0,0,0,0.85);">{page_name}</span>
        </div>

        <h1 style="font-size: 20px; font-weight: 500; color: rgba(0,0,0,0.85); margin-bottom: 24px;">{page_name}</h1>

        <div class="ant-card" style="margin-bottom: 24px;">
          <div class="ant-card-body">
            {search_html}
          </div>
        </div>

        <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
          <div>{actions_html}</div>
        </div>

        <div class="ant-card">
          <div class="ant-table-wrapper">
            <div class="ant-table">
              <div class="ant-table-container">
                <div class="ant-table-content">
                  <table style="table-layout: auto; width: 100%;">
                    <thead class="ant-table-thead">
                      <tr>
{th_html}                      </tr>
                    </thead>
                    <tbody class="ant-table-tbody">
{tbody_html}                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div style="padding: 16px; display: flex; justify-content: flex-end; align-items: center; gap: 8px;">
            <span style="color: rgba(0,0,0,0.45); font-size: 14px;">共 156 条</span>
            <ul class="ant-pagination">
              <li class="ant-pagination-prev ant-pagination-disabled"><button class="ant-pagination-item-link" disabled>&lt;</button></li>
              <li class="ant-pagination-item ant-pagination-item-active"><a>1</a></li>
              <li class="ant-pagination-item"><a>2</a></li>
              <li class="ant-pagination-item"><a>3</a></li>
              <li class="ant-pagination-next"><button class="ant-pagination-item-link">&gt;</button></li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  </div>'''


def generate_form_page(config: Dict) -> str:
    data = config.get('data', {})
    page_name = config.get('page_name', '表单页')
    fields = data.get('fields', [])

    fields_html = ''
    for field in fields:
        required_mark = '<span style="color: #ff4d4f;">*</span>' if field.get('required') else ''
        label = field.get('label', '字段')
        if field.get('type') == 'select':
            options = ''.join([f'<option>{opt}</option>' for opt in field.get('options', ['选项1', '选项2'])])
            input_html = f'<select class="ant-input" style="width: 100%;"><option>请选择</option>{options}</select>'
        elif field.get('type') == 'textarea':
            input_html = f'<textarea class="ant-input" rows="3" placeholder="请输入{label}" style="width: 100%; resize: vertical;"></textarea>'
        else:
            input_html = f'<input class="ant-input" placeholder="请输入{label}" style="width: 100%;">'

        fields_html += f'''
          <div style="margin-bottom: 24px;">
            <div style="margin-bottom: 8px;">
              <label style="color: rgba(0,0,0,0.85); font-weight: 500;">{label} {required_mark}</label>
            </div>
            {input_html}
          </div>'''

    return f'''  <div class="ant-layout" style="min-height: 100vh;">
    <header class="ant-layout-header" style="background: #fff; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 1px 4px rgba(0,21,41,0.08); height: 64px;">
      <div style="display: flex; align-items: center; gap: 16px;">
        <div style="width: 32px; height: 32px; background: #1890ff; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold;">S</div>
        <span style="font-size: 18px; font-weight: 500; color: rgba(0,0,0,0.85);">系统后台</span>
      </div>
      <div style="display: flex; align-items: center; gap: 16px;">
        <span style="color: rgba(0,0,0,0.65);">管理员</span>
        <div style="width: 32px; height: 32px; background: #f0f0f0; border-radius: 50%;"></div>
      </div>
    </header>

    <div style="display: flex; flex: 1;">
      <aside style="background: #001529; width: 200px; flex-shrink: 0;">
        <ul class="ant-menu ant-menu-dark ant-menu-root" style="background: #001529; padding: 16px 0;">
          <li class="ant-menu-item" style="padding-left: 24px; color: rgba(255,255,255,0.65);">
            <span>🏠</span><span style="margin-left: 10px;">首页</span>
          </li>
          <li class="ant-menu-item ant-menu-item-selected" style="background: #1890ff; padding-left: 24px;">
            <span>📝</span><span style="margin-left: 10px;">{page_name}</span>
          </li>
        </ul>
      </aside>

      <main style="flex: 1; padding: 24px; background: #f0f2f5; overflow: auto;">
        <div class="ant-breadcrumb" style="margin-bottom: 16px;">
          <span style="color: rgba(0,0,0,0.45);">首页</span>
          <span class="ant-breadcrumb-separator">/</span>
          <span style="color: rgba(0,0,0,0.85);">{page_name}</span>
        </div>

        <div class="ant-card" style="max-width: 800px;">
          <div class="ant-card-head"><div class="ant-card-head-wrapper"><div class="ant-card-head-title">{page_name}</div></div></div>
          <div class="ant-card-body" style="padding: 24px;">
            <form>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0 24px;">
{fields_html}
              </div>
              <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #f0f0f0; text-align: center;">
                <button type="button" class="ant-btn" style="margin-right: 8px;" onclick="mockAction('取消')">取消</button>
                <button type="button" class="ant-btn ant-btn-primary" onclick="mockAction('提交')">提交</button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  </div>'''


def generate_detail_page(config: Dict) -> str:
    data = config.get('data', {})
    page_name = config.get('page_name', '详情页')
    groups = data.get('groups', [])

    groups_html = ''
    for group in groups:
        fields_html = ''
        for field in group.get('fields', []):
            fields_html += f'''
            <div style="display: flex; padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
              <span style="color: rgba(0,0,0,0.45); width: 140px; flex-shrink: 0;">{field}：</span>
              <span style="color: rgba(0,0,0,0.85);">示例{field}数据</span>
            </div>'''

        groups_html += f'''
        <div class="ant-card" style="margin-bottom: 16px;">
          <div class="ant-card-head"><div class="ant-card-head-wrapper"><div class="ant-card-head-title">{group.get('title', '分组')}</div></div></div>
          <div class="ant-card-body">{fields_html}
          </div>
        </div>'''

    return f'''  <div class="ant-layout" style="min-height: 100vh;">
    <header class="ant-layout-header" style="background: #fff; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 1px 4px rgba(0,21,41,0.08); height: 64px;">
      <div style="display: flex; align-items: center; gap: 16px;">
        <div style="width: 32px; height: 32px; background: #1890ff; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold;">S</div>
        <span style="font-size: 18px; font-weight: 500; color: rgba(0,0,0,0.85);">系统后台</span>
      </div>
      <div style="display: flex; align-items: center; gap: 16px;">
        <span style="color: rgba(0,0,0,0.65);">管理员</span>
        <div style="width: 32px; height: 32px; background: #f0f0f0; border-radius: 50%;"></div>
      </div>
    </header>

    <div style="display: flex; flex: 1;">
      <aside style="background: #001529; width: 200px; flex-shrink: 0;">
        <ul class="ant-menu ant-menu-dark ant-menu-root" style="background: #001529; padding: 16px 0;">
          <li class="ant-menu-item" style="padding-left: 24px; color: rgba(255,255,255,0.65);">
            <span>🏠</span><span style="margin-left: 10px;">首页</span>
          </li>
          <li class="ant-menu-item ant-menu-item-selected" style="background: #1890ff; padding-left: 24px;">
            <span>📄</span><span style="margin-left: 10px;">{page_name}</span>
          </li>
        </ul>
      </aside>

      <main style="flex: 1; padding: 24px; background: #f0f2f5; overflow: auto;">
        <div class="ant-breadcrumb" style="margin-bottom: 16px;">
          <span style="color: rgba(0,0,0,0.45);">首页</span>
          <span class="ant-breadcrumb-separator">/</span>
          <span style="color: rgba(0,0,0,0.85);">{page_name}</span>
        </div>

        <div style="margin-bottom: 16px;">
          <button class="ant-btn ant-btn-primary" style="margin-right: 8px;" onclick="mockAction('编辑')">编辑</button>
          <button class="ant-btn" onclick="mockAction('返回')">返回列表</button>
        </div>

{groups_html}
      </main>
    </div>
  </div>'''


def generate_description(config: Dict) -> str:
    page_name = config.get('page_name', '页面')
    clarification = config.get('clarification', {})
    interactions = clarification.get('interactions', {})
    boundary = clarification.get('boundary', {})
    layout = clarification.get('layout', {})

    interactions_html = ''
    if interactions.get('buttons'):
        for btn in interactions['buttons']:
            interactions_html += f'''      <div class="doc-item">
        <span class="doc-label">{btn}</span>
        <span class="doc-content">点击后触发相应操作</span>
      </div>\n'''

    boundary_html = ''
    if boundary.get('empty_state'):
        boundary_html += f'      <div class="doc-item"><span class="doc-label">空数据</span><span class="doc-content">{boundary["empty_state"]}</span></div>\n'
    if boundary.get('loading_state'):
        boundary_html += f'      <div class="doc-item"><span class="doc-label">加载中</span><span class="doc-content">{boundary["loading_state"]}</span></div>\n'
    if boundary.get('error_state'):
        boundary_html += f'      <div class="doc-item"><span class="doc-label">错误</span><span class="doc-content">{boundary["error_state"]}</span></div>\n'

    return f'''      <div class="doc-section">
        <div class="doc-title">页面概述</div>
        <p style="color: rgba(0,0,0,0.65); line-height: 1.6;">本页面为{page_name}原型，展示页面布局、组件和交互逻辑。</p>
        <p style="color: rgba(0,0,0,0.45); font-size: 13px; margin-top: 8px;">生成日期: {datetime.now().strftime('%Y-%m-%d')}</p>
      </div>

      <div class="doc-section">
        <div class="doc-title">布局结构</div>
        <div class="doc-item">
          <span class="doc-label">布局类型</span>
          <span class="doc-content">{layout.get('type', '顶栏 + 侧边栏 + 内容区')}</span>
        </div>
      </div>

      <div class="doc-section">
        <div class="doc-title">交互逻辑</div>
{interactions_html if interactions_html else '      <p style="color: rgba(0,0,0,0.45); font-size: 14px;">标准交互逻辑</p>'}
      </div>

      <div class="doc-section">
        <div class="doc-title">边界场景</div>
{boundary_html if boundary_html else '      <p style="color: rgba(0,0,0,0.45); font-size: 14px;">按标准处理</p>'}
      </div>'''


def extract_version_from_file_name(file_name: str) -> int:
    match = re.search(r'-v(\d+)(?:\.html)?$', file_name)
    if match:
        return int(match.group(1))
    return 1


def generate_file_name(output_dir: Path, page_slug: str, scenario: str, old_file_name: Optional[str]) -> str:
    date_str = datetime.now().strftime('%Y%m%d')

    if scenario == 'refactor' and old_file_name:
        old_version = extract_version_from_file_name(old_file_name)
        new_version = old_version + 1
        file_name = f"prototype-{date_str}-{page_slug}-v{new_version}.html"
        while (output_dir / file_name).exists():
            new_version += 1
            file_name = f"prototype-{date_str}-{page_slug}-v{new_version}.html"
    else:
        file_name = f"prototype-{date_str}-{page_slug}.html"
        if (output_dir / file_name).exists():
            version = 2
            while (output_dir / f"prototype-{date_str}-{page_slug}-v{version}.html").exists():
                version += 1
            file_name = f"prototype-{date_str}-{page_slug}-v{version}.html"

    return file_name


def generate_page(config: Dict) -> Dict:
    try:
        page_name = config.get('page_name')
        page_type = config.get('page_type', 'list')
        output_path_str = config.get('output_path', 'docs/prototype')
        scenario = config.get('scenario', 'new')

        if not page_name:
            return {"status": "error", "message": "缺少 page_name 参数"}

        output_dir = Path(output_path_str)
        output_dir.mkdir(parents=True, exist_ok=True)

        page_slug = page_name.lower().replace(' ', '-').replace('_', '-')
        file_name = generate_file_name(output_dir, page_slug, scenario, config.get('old_file_name'))

        page_generators = {
            'list': generate_list_page,
            'form': generate_form_page,
            'detail': generate_detail_page,
        }

        generator = page_generators.get(page_type, generate_list_page)
        prototype_content = generator(config)
        description_content = generate_description(config)
        full_html = generate_base_html(page_name, prototype_content, description_content)

        file_path = output_dir / file_name
        file_path.write_text(full_html, encoding='utf-8')

        return {
            "file_path": str(file_path),
            "file_name": file_name,
            "status": "success",
            "message": "生成成功" if scenario == 'new' else "改造成功，已生成新版本",
            "page_info": {
                "name": page_name,
                "type": page_type,
                "scenario": scenario,
                "version": extract_version_from_file_name(file_name)
            }
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "error": {"type": "generation_error", "detail": str(e)}
        }


def main():
    parser = argparse.ArgumentParser(description='生成原型页面HTML')
    parser.add_argument('--config', '-c', help='JSON配置文件路径')
    parser.add_argument('--input', '-i', help='JSON格式的输入参数')
    parser.add_argument('--output', '-o', help='输出结果到文件')

    args = parser.parse_args()

    if args.config:
        config = json.loads(Path(args.config).read_text(encoding='utf-8'))
    elif args.input:
        config = json.loads(args.input)
    else:
        config = json.loads(sys.stdin.read())

    result = generate_page(config)

    output = json.dumps(result, ensure_ascii=False, indent=2)
    if args.output:
        Path(args.output).write_text(output, encoding='utf-8')
    else:
        print(output)

    sys.exit(0 if result['status'] == 'success' else 1)


if __name__ == '__main__':
    main()
