use tauri::{
  menu::{Menu, MenuItem},
  tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
  AppHandle, Manager,
};
use tauri_plugin_positioner::{on_tray_event, Position, WindowExt};

const BALL_SIZE: (f64, f64) = (76.0, 76.0);
const PANEL_SIZE: (f64, f64) = (760.0, 620.0);
const DEFAULT_POSITION: (f64, f64) = (48.0, 48.0);

#[tauri::command]
fn expand_to_panel(app: AppHandle) -> Result<(), String> {
  let window = app.get_webview_window("main").ok_or("missing main window")?;
  let position = window.outer_position().map_err(|err| err.to_string())?;

  window
    .set_size(tauri::Size::Logical(tauri::LogicalSize {
      width: PANEL_SIZE.0,
      height: PANEL_SIZE.1,
    }))
    .map_err(|err| err.to_string())?;

  window
    .set_position(tauri::Position::Physical(tauri::PhysicalPosition {
      x: position.x,
      y: position.y,
    }))
    .map_err(|err| err.to_string())?;

  window.set_focus().map_err(|err| err.to_string())?;
  Ok(())
}

#[tauri::command]
fn collapse_to_ball(app: AppHandle) -> Result<(), String> {
  let window = app.get_webview_window("main").ok_or("missing main window")?;
  window
    .set_size(tauri::Size::Logical(tauri::LogicalSize {
      width: BALL_SIZE.0,
      height: BALL_SIZE.1,
    }))
    .map_err(|err| err.to_string())?;
  Ok(())
}

#[tauri::command]
fn sync_window_position(app: AppHandle, x: f64, y: f64) -> Result<(), String> {
  let window = app.get_webview_window("main").ok_or("missing main window")?;
  window
    .set_position(tauri::Position::Logical(tauri::LogicalPosition { x, y }))
    .map_err(|err| err.to_string())?;
  Ok(())
}

pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_opener::init())
    .plugin(tauri_plugin_positioner::init())
    .plugin(tauri_plugin_log::Builder::default().level(log::LevelFilter::Info).build())
    .invoke_handler(tauri::generate_handler![expand_to_panel, collapse_to_ball, sync_window_position])
    .setup(|app| {
      let window = app.get_webview_window("main").ok_or("missing main window")?;
      let _ = window.set_position(tauri::Position::Logical(tauri::LogicalPosition {
        x: DEFAULT_POSITION.0,
        y: DEFAULT_POSITION.1,
      }));

      let show_item = MenuItem::with_id(app, "show", "显示面板", true, None::<&str>)?;
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
            let _ = expand_to_panel(tray.app_handle().clone());
          }
        })
        .on_menu_event(move |app, event| match event.id().as_ref() {
          "show" => {
            let _ = expand_to_panel(app.clone());
            if let Some(window) = app.get_webview_window("main") {
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
