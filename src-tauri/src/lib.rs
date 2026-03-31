use tauri::{
  menu::{Menu, MenuItem},
  tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
  AppHandle, Manager, WebviewWindow, WebviewWindowBuilder,
};
use tauri_plugin_positioner::{on_tray_event, Position, WindowExt};

const BALL_LABEL: &str = "ball";
const PANEL_LABEL: &str = "panel";
const BALL_SIZE: (f64, f64) = (96.0, 96.0);
const PANEL_SIZE: (f64, f64) = (920.0, 780.0);

fn build_ball_window(app: &AppHandle) -> Result<WebviewWindow, tauri::Error> {
  if let Some(window) = app.get_webview_window(BALL_LABEL) {
    return Ok(window);
  }

  WebviewWindowBuilder::new(app, BALL_LABEL, tauri::WebviewUrl::App("ball.html".into()))
    .title("Todo Ball")
    .decorations(false)
    .transparent(true)
    .always_on_top(true)
    .skip_taskbar(true)
    .resizable(false)
    .inner_size(BALL_SIZE.0, BALL_SIZE.1)
    .min_inner_size(BALL_SIZE.0, BALL_SIZE.1)
    .max_inner_size(BALL_SIZE.0, BALL_SIZE.1)
    .visible(true)
    .build()
}

fn build_panel_window(app: &AppHandle) -> Result<WebviewWindow, tauri::Error> {
  if let Some(window) = app.get_webview_window(PANEL_LABEL) {
    return Ok(window);
  }

  WebviewWindowBuilder::new(app, PANEL_LABEL, tauri::WebviewUrl::App("panel.html".into()))
    .title("Todo Desktop")
    .decorations(false)
    .transparent(true)
    .always_on_top(true)
    .skip_taskbar(false)
    .inner_size(PANEL_SIZE.0, PANEL_SIZE.1)
    .min_inner_size(720.0, 620.0)
    .visible(false)
    .build()
}

fn position_panel(app: &AppHandle) -> Result<(), String> {
  let ball = build_ball_window(app).map_err(|err| err.to_string())?;
  let panel = build_panel_window(app).map_err(|err| err.to_string())?;
  let position = ball.outer_position().map_err(|err| err.to_string())?;

  panel
    .set_position(tauri::Position::Physical(tauri::PhysicalPosition {
      x: position.x + 112,
      y: position.y,
    }))
    .map_err(|err| err.to_string())?;

  Ok(())
}

#[tauri::command]
fn toggle_panel_window(app: AppHandle) -> Result<(), String> {
  let panel = build_panel_window(&app).map_err(|err| err.to_string())?;
  if panel.is_visible().map_err(|err| err.to_string())? {
    panel.hide().map_err(|err| err.to_string())?;
  } else {
    position_panel(&app)?;
    panel.show().map_err(|err| err.to_string())?;
    panel.set_focus().map_err(|err| err.to_string())?;
  }
  Ok(())
}

#[tauri::command]
fn show_panel_window(app: AppHandle) -> Result<(), String> {
  let panel = build_panel_window(&app).map_err(|err| err.to_string())?;
  position_panel(&app)?;
  panel.show().map_err(|err| err.to_string())?;
  panel.set_focus().map_err(|err| err.to_string())?;
  Ok(())
}

#[tauri::command]
fn hide_panel_window(app: AppHandle) -> Result<(), String> {
  let panel = build_panel_window(&app).map_err(|err| err.to_string())?;
  panel.hide().map_err(|err| err.to_string())?;
  Ok(())
}

#[tauri::command]
fn sync_ball_position(app: AppHandle, x: f64, y: f64) -> Result<(), String> {
  let ball = build_ball_window(&app).map_err(|err| err.to_string())?;
  ball.set_position(tauri::Position::Logical(tauri::LogicalPosition { x, y }))
    .map_err(|err| err.to_string())?;

  if let Some(panel) = app.get_webview_window(PANEL_LABEL) {
    if panel.is_visible().map_err(|err| err.to_string())? {
      position_panel(&app)?;
    }
  }

  Ok(())
}

pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_opener::init())
    .plugin(tauri_plugin_positioner::init())
    .plugin(tauri_plugin_log::Builder::default().level(log::LevelFilter::Info).build())
    .invoke_handler(tauri::generate_handler![toggle_panel_window, show_panel_window, hide_panel_window, sync_ball_position])
    .setup(|app| {
      build_ball_window(app.handle())?;
      build_panel_window(app.handle())?;

      let show_item = MenuItem::with_id(app, "show", "显示主面板", true, None::<&str>)?;
      let quit_item = MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?;
      let menu = Menu::with_items(app, &[&show_item, &quit_item])?;

      TrayIconBuilder::new()
        .tooltip("Todo Desktop")
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_tray_icon_event(move |tray, event| {
          on_tray_event(tray.app_handle(), &event);
          if let TrayIconEvent::Click {
            button: MouseButton::Left,
            button_state: MouseButtonState::Up,
            ..
          } = event
          {
            let _ = show_panel_window(tray.app_handle().clone());
          }
        })
        .on_menu_event(move |app, event| match event.id().as_ref() {
          "show" => {
            let _ = show_panel_window(app.clone());
            if let Some(window) = app.get_webview_window(PANEL_LABEL) {
              let _ = window.move_window(Position::TopRight);
            }
          }
          "quit" => {
            app.exit(0);
          }
          _ => {}
        })
        .build(app)?;

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
