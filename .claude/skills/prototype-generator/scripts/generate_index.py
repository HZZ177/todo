"""
原型目录页生成脚本
扫描指定目录下的原型HTML文件，生成 index.html 目录页
目录页使用 iframe 全屏预览 + 左上角浮动按钮打开抽屉切换文件

用法:
    python generate_index.py --dir <prototype_dir>
    python generate_index.py --dir docs/prototype --title "项目原型"
"""

import argparse
import json
import re
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List


PAGE_TYPE_ICONS = {
    'list': '📋',
    'form': '📝',
    'detail': '📄',
    'dashboard': '📊',
}


def scan_prototypes(prototype_dir: Path) -> List[Dict]:
    prototypes = []
    for html_file in sorted(prototype_dir.glob('prototype-*.html')):
        info = parse_prototype_file(html_file)
        if info:
            prototypes.append(info)
    return prototypes


def parse_prototype_file(file_path: Path) -> Dict:
    file_name = file_path.name
    stem = file_path.stem

    match = re.match(r'prototype-(\d{8})-(.+?)(?:-v(\d+))?$', stem)
    if not match:
        return {
            'file_name': file_name,
            'page_name': stem,
            'page_type': 'unknown',
            'date': '',
            'version': 1,
        }

    date_str = match.group(1)
    page_slug = match.group(2)
    version = int(match.group(3)) if match.group(3) else 1

    page_name = page_slug.replace('-', ' ').title()

    content = file_path.read_text(encoding='utf-8', errors='ignore')
    title_match = re.search(r'<title>原型 - (.+?)</title>', content)
    if title_match:
        page_name = title_match.group(1)

    page_type = 'list'
    if 'form' in page_slug or '表单' in page_name or '新建' in page_name or '编辑' in page_name:
        page_type = 'form'
    elif 'detail' in page_slug or '详情' in page_name:
        page_type = 'detail'
    elif 'dashboard' in page_slug or '仪表' in page_name or '概览' in page_name:
        page_type = 'dashboard'

    formatted_date = f'{date_str[:4]}-{date_str[4:6]}-{date_str[6:]}'

    return {
        'file_name': file_name,
        'page_name': page_name,
        'page_type': page_type,
        'date': formatted_date,
        'version': version,
    }


def generate_index_html(prototypes: List[Dict], title: str = '原型目录') -> str:
    count = len(prototypes)
    first_file = prototypes[0]['file_name'] if prototypes else 'about:blank'

    file_items_html = ''
    for i, proto in enumerate(prototypes):
        icon = PAGE_TYPE_ICONS.get(proto['page_type'], '📄')
        active_class = ' active' if i == 0 else ''
        version_text = f' v{proto["version"]}' if proto['version'] > 1 else ''
        meta_text = f'{proto["page_type"]}{version_text} · {proto["date"]}'

        file_items_html += f'''        <div class="nav-file-item{active_class}" onclick="loadPage(this, '{proto["file_name"]}')" data-file="{proto["file_name"]}">
          <span class="file-icon">{icon}</span>
          <div class="file-info">
            <div class="file-name">{proto["page_name"]}</div>
            <div class="file-meta">{meta_text}</div>
          </div>
        </div>
'''

    return f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <style>
    * {{ margin: 0; padding: 0; box-sizing: border-box; }}
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }}

    #previewFrame {{
      width: 100vw;
      height: 100vh;
      border: none;
      display: block;
    }}

    .nav-fab {{
      position: fixed;
      top: 16px;
      left: 16px;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      background: #1677ff;
      color: #fff;
      border: none;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(22, 119, 255, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      z-index: 999;
      transition: all 0.3s;
    }}
    .nav-fab:hover {{
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(22, 119, 255, 0.5);
    }}

    .nav-drawer-mask {{
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s;
    }}
    .nav-drawer-mask.visible {{
      opacity: 1;
      visibility: visible;
    }}

    .nav-drawer {{
      position: fixed;
      top: 0;
      left: 0;
      width: 320px;
      height: 100vh;
      background: #fff;
      z-index: 1001;
      box-shadow: 6px 0 16px rgba(0, 0, 0, 0.08);
      transform: translateX(-100%);
      transition: transform 0.3s ease;
      display: flex;
      flex-direction: column;
    }}
    .nav-drawer.open {{
      transform: translateX(0);
    }}

    .nav-drawer-header {{
      padding: 20px 24px;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }}
    .nav-drawer-header h2 {{
      font-size: 16px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.85);
      margin: 0 0 4px 0;
    }}
    .nav-drawer-header .count {{
      font-size: 13px;
      color: rgba(0, 0, 0, 0.45);
    }}
    .nav-drawer-close {{
      background: none;
      border: none;
      cursor: pointer;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.45);
      padding: 2px;
    }}
    .nav-drawer-close:hover {{
      color: rgba(0, 0, 0, 0.85);
    }}

    .nav-file-list {{
      flex: 1;
      overflow-y: auto;
      padding: 8px 0;
    }}

    .nav-file-item {{
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 24px;
      cursor: pointer;
      transition: all 0.2s;
      border-left: 3px solid transparent;
    }}
    .nav-file-item:hover {{
      background: #f5f5f5;
    }}
    .nav-file-item.active {{
      background: #e6f7ff;
      border-left-color: #1677ff;
    }}
    .nav-file-item .file-icon {{
      font-size: 20px;
      flex-shrink: 0;
    }}
    .nav-file-item .file-info {{
      flex: 1;
      min-width: 0;
    }}
    .nav-file-item .file-name {{
      font-size: 14px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }}
    .nav-file-item .file-meta {{
      font-size: 12px;
      color: rgba(0, 0, 0, 0.45);
      margin-top: 2px;
    }}
  </style>
</head>
<body>
  <!-- 全屏预览 iframe -->
  <iframe id="previewFrame" src="{first_file}"></iframe>

  <!-- 左上角浮动按钮 -->
  <button class="nav-fab" onclick="toggleNav()" title="打开原型目录">☰</button>

  <!-- 目录抽屉（从左侧滑入） -->
  <div class="nav-drawer-mask" id="navMask" onclick="toggleNav()"></div>
  <div class="nav-drawer" id="navDrawer">
    <div class="nav-drawer-header">
      <div>
        <h2>📐 {title}</h2>
        <span class="count">共 {count} 个原型页面</span>
      </div>
      <button class="nav-drawer-close" onclick="toggleNav()">✕</button>
    </div>
    <div class="nav-file-list">
{file_items_html}    </div>
  </div>

  <script>
    function toggleNav() {{
      document.getElementById('navMask').classList.toggle('visible');
      document.getElementById('navDrawer').classList.toggle('open');
    }}

    function loadPage(el, filename) {{
      document.querySelectorAll('.nav-file-item').forEach(function(item) {{
        item.classList.remove('active');
      }});
      el.classList.add('active');
      document.getElementById('previewFrame').src = filename;
      toggleNav();
    }}
  </script>
</body>
</html>'''


def generate_index(prototype_dir: str, title: str = '原型目录') -> Dict:
    try:
        dir_path = Path(prototype_dir)
        if not dir_path.exists():
            return {
                "status": "error",
                "message": f"目录不存在: {prototype_dir}",
            }

        prototypes = scan_prototypes(dir_path)

        if not prototypes:
            return {
                "status": "error",
                "message": "目录下没有找到原型文件（prototype-*.html）",
            }

        index_html = generate_index_html(prototypes, title)

        index_path = dir_path / 'index.html'
        index_path.write_text(index_html, encoding='utf-8')

        return {
            "file_path": str(index_path),
            "status": "success",
            "message": f"目录页生成成功，包含 {len(prototypes)} 个原型页面",
            "prototype_count": len(prototypes),
            "prototypes": [
                {"file_name": p["file_name"], "page_name": p["page_name"]}
                for p in prototypes
            ],
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
        }


def main():
    parser = argparse.ArgumentParser(description='生成原型目录页（浮动按钮+抽屉导航）')
    parser.add_argument('--dir', '-d', required=True, help='原型文件所在目录')
    parser.add_argument('--title', '-t', default='原型目录', help='目录页标题')
    parser.add_argument('--output', '-o', help='输出结果到JSON文件')

    args = parser.parse_args()

    result = generate_index(args.dir, args.title)

    output = json.dumps(result, ensure_ascii=False, indent=2)
    if args.output:
        Path(args.output).write_text(output, encoding='utf-8')
    else:
        print(output)

    sys.exit(0 if result['status'] == 'success' else 1)


if __name__ == '__main__':
    main()
