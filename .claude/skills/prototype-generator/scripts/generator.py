"""
原型HTML生成辅助脚本
用于生成符合Ant Design风格的HTML原型页面（全屏布局 + 浮动按钮 + 需求说明抽屉）
"""

from datetime import datetime
from pathlib import Path
from typing import List, Dict, Optional
import json
import re


class PrototypeTemplate:
    """原型HTML模板生成器"""

    COLORS = {
        'primary': '#1890ff',
        'primary_hover': '#40a9ff',
        'primary_active': '#096dd9',
        'success': '#52c41a',
        'warning': '#faad14',
        'error': '#f5222d',
        'info': '#1890ff',
        'text': 'rgba(0, 0, 0, 0.85)',
        'text_secondary': 'rgba(0, 0, 0, 0.45)',
        'border': '#d9d9d9',
        'bg': '#f0f2f5',
        'white': '#ffffff',
    }

    @staticmethod
    def generate_base_html(title: str, prototype_content: str, description_content: str) -> str:
        return f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>原型 - {title}</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/4.24.15/antd.min.css">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    .fab-btn {{
      position: fixed; bottom: 32px; right: 32px;
      width: 48px; height: 48px; border-radius: 50%;
      background: #1890ff; color: #fff; border: none; cursor: pointer;
      box-shadow: 0 4px 12px rgba(24,144,255,0.4);
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; z-index: 999; transition: all 0.3s;
    }}
    .fab-btn:hover {{ transform: scale(1.1); box-shadow: 0 6px 16px rgba(24,144,255,0.5); }}

    .drawer-mask {{
      position: fixed; inset: 0; background: rgba(0,0,0,0.45);
      z-index: 1000; opacity: 0; visibility: hidden; transition: all 0.3s;
    }}
    .drawer-mask.visible {{ opacity: 1; visibility: visible; }}

    .drawer-panel {{
      position: fixed; top: 0; right: 0; width: 520px; height: 100vh;
      background: #fff; z-index: 1001;
      box-shadow: -6px 0 16px rgba(0,0,0,0.08);
      transform: translateX(100%); transition: transform 0.3s ease;
      display: flex; flex-direction: column;
    }}
    .drawer-panel.open {{ transform: translateX(0); }}

    .drawer-header {{
      padding: 16px 24px; border-bottom: 1px solid #f0f0f0;
      display: flex; justify-content: space-between; align-items: center;
    }}
    .drawer-body {{ flex: 1; padding: 24px; overflow-y: auto; }}

    .doc-section {{ background: #fafafa; border-radius: 8px; padding: 20px; margin-bottom: 16px; }}
    .doc-title {{ font-size: 15px; font-weight: 600; color: rgba(0,0,0,0.85); margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid #f0f0f0; }}
    .doc-item {{ display: flex; gap: 12px; margin-bottom: 10px; font-size: 14px; line-height: 1.6; }}
    .doc-label {{ font-weight: 500; color: rgba(0,0,0,0.65); min-width: 90px; flex-shrink: 0; }}
    .doc-content {{ color: rgba(0,0,0,0.45); }}
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

    @staticmethod
    def generate_list_page(
        title: str,
        columns: List[Dict],
        search_fields: List[Dict],
        actions: List[str] = None,
        mock_data: List[Dict] = None
    ) -> str:
        search_html = '<div style="display: flex; flex-wrap: wrap; gap: 16px; align-items: center;">\n'
        for field in search_fields:
            if field.get('type') == 'select':
                options = ''.join([f'<option>{opt}</option>' for opt in field.get('options', [])])
                search_html += f'          <select class="ant-input" style="width: 150px;"><option>全部{field["label"]}</option>{options}</select>\n'
            else:
                search_html += f'          <input class="ant-input" placeholder="请输入{field["label"]}" style="width: 200px;">\n'
        search_html += '          <button class="ant-btn ant-btn-primary" onclick="mockAction(\'搜索\')">搜索</button>\n'
        search_html += '          <button class="ant-btn" onclick="mockAction(\'重置\')">重置</button>\n'
        search_html += '        </div>'

        actions_html = ''
        if actions:
            actions_html = '<div style="display: flex; gap: 8px;">\n'
            for action in actions:
                btn_class = 'ant-btn-primary' if action in ['新增', '创建', '添加'] else ''
                actions_html += f'            <button class="ant-btn {btn_class}" onclick="mockAction(\'{action}\')">{action}</button>\n'
            actions_html += '          </div>'

        th_html = ''.join([f'              <th class="ant-table-cell" style="padding: 12px 16px;">{col["title"]}</th>\n' for col in columns])

        tbody_html = ''
        if mock_data:
            for row in mock_data:
                tbody_html += '            <tr class="ant-table-row">\n'
                for col in columns:
                    value = row.get(col['dataIndex'], '')
                    if col.get('render') == 'tag':
                        color = row.get(col["dataIndex"] + "_color", "blue")
                        tag_map = {'green': 'ant-tag-success', 'red': 'ant-tag-error', 'orange': 'ant-tag-warning', 'blue': 'ant-tag-blue'}
                        tag_cls = tag_map.get(color, '')
                        value = f'<span class="ant-tag {tag_cls}">{value}</span>'
                    elif col.get('render') == 'actions':
                        value = ('<a style="color: #1890ff; cursor: pointer;" onclick="mockAction(\'编辑\')">编辑</a>'
                                 '<span style="margin: 0 8px; color: #d9d9d9;">|</span>'
                                 '<a style="color: #ff4d4f; cursor: pointer;" onclick="mockAction(\'删除\')">删除</a>')
                    elif col.get('render') == 'date':
                        value = f'<span style="color: rgba(0,0,0,0.45);">{value}</span>'
                    tbody_html += f'              <td class="ant-table-cell" style="padding: 12px 16px;">{value}</td>\n'
                tbody_html += '            </tr>\n'

        return f'''  <div class="ant-layout" style="min-height: 100vh;">
    <header class="ant-layout-header" style="background: #fff; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 1px 4px rgba(0,21,41,0.08); height: 64px;">
      <div style="display: flex; align-items: center; gap: 16px;">
        <div style="width: 32px; height: 32px; background: #1890ff; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold;">S</div>
        <span style="font-size: 18px; font-weight: 500;">系统后台</span>
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
            <span>📋</span><span style="margin-left: 10px;">{title}</span>
          </li>
        </ul>
      </aside>

      <main style="flex: 1; padding: 24px; background: #f0f2f5; overflow: auto;">
        <div class="ant-breadcrumb" style="margin-bottom: 16px;">
          <span style="color: rgba(0,0,0,0.45);">首页</span>
          <span class="ant-breadcrumb-separator">/</span>
          <span>{title}</span>
        </div>

        <div class="ant-card" style="margin-bottom: 16px;">
          <div class="ant-card-body" style="padding: 16px 24px;">
            {search_html}
          </div>
        </div>

        <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
          {actions_html}
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
              <li class="ant-pagination-item ant-pagination-item-active"><a>1</a></li>
              <li class="ant-pagination-item"><a>2</a></li>
              <li class="ant-pagination-item"><a>3</a></li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  </div>'''

    @staticmethod
    def generate_description(
        page_name: str,
        overview: str,
        sections: List[Dict]
    ) -> str:
        sections_html = ''
        for i, section in enumerate(sections, 1):
            items_html = ''
            if 'items' in section:
                for item in section['items']:
                    items_html += f'''        <div class="doc-item">
          <span class="doc-label">{item['label']}</span>
          <span class="doc-content">{item['desc']}</span>
        </div>\n'''

            sections_html += f'''      <div class="doc-section">
        <div class="doc-title">{i+1}. {section['title']}</div>
{items_html}      </div>\n'''

        return f'''      <div class="doc-section">
        <div class="doc-title">1. 页面概述</div>
        <p style="color: rgba(0,0,0,0.65); line-height: 1.6;">{overview}</p>
        <p style="color: rgba(0,0,0,0.45); font-size: 13px; margin-top: 8px;">生成日期: {datetime.now().strftime('%Y-%m-%d')}</p>
      </div>

{sections_html}'''


def save_prototype(
    page_name: str,
    output_dir: str,
    prototype_content: str,
    description_content: str,
    scenario: str = 'new',
    old_file_name: Optional[str] = None
) -> Dict[str, str]:
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    page_slug = page_name.lower().replace(' ', '-').replace('_', '-')

    if scenario == 'refactor' and old_file_name:
        file_name = _generate_refactor_file_name(output_path, page_slug, old_file_name)
    else:
        date_str = datetime.now().strftime('%Y%m%d')
        file_name = f"prototype-{date_str}-{page_slug}.html"

        if (output_path / file_name).exists():
            file_name = _generate_versioned_file_name(output_path, page_slug, date_str)

    full_html = PrototypeTemplate.generate_base_html(
        title=page_name,
        prototype_content=prototype_content,
        description_content=description_content
    )

    file_path = output_path / file_name
    file_path.write_text(full_html, encoding='utf-8')

    version = _extract_version_from_file_name(file_name)

    return {
        "file_path": str(file_path),
        "file_name": file_name,
        "version": version,
        "scenario": scenario
    }


def _generate_versioned_file_name(output_path: Path, page_slug: str, date_str: str) -> str:
    version = 2
    while True:
        file_name = f"prototype-{date_str}-{page_slug}-v{version}.html"
        if not (output_path / file_name).exists():
            return file_name
        version += 1
        if version > 1000:
            raise RuntimeError(f"无法生成文件名，版本号超过限制: {page_slug}")


def _generate_refactor_file_name(output_path: Path, page_slug: str, old_file_name: str) -> str:
    date_str = datetime.now().strftime('%Y%m%d')
    old_version = _extract_version_from_file_name(old_file_name)
    new_version = old_version + 1

    file_name = f"prototype-{date_str}-{page_slug}-v{new_version}.html"
    while (output_path / file_name).exists():
        new_version += 1
        file_name = f"prototype-{date_str}-{page_slug}-v{new_version}.html"
        if new_version > 1000:
            raise RuntimeError(f"无法生成文件名，版本号超过限制: {page_slug}")

    return file_name


def _extract_version_from_file_name(file_name: str) -> int:
    match = re.search(r'-v(\d+)(?:\.html)?$', file_name)
    if match:
        return int(match.group(1))
    return 1
