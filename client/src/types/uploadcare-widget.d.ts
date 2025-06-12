declare module 'uploadcare-widget' {
  interface UploadcareWidget {
    openDialog(file: any, options: any): {
      done: (callback: (file: any) => void) => void;
    };
  }

  const widget: UploadcareWidget;
  export default widget;
}