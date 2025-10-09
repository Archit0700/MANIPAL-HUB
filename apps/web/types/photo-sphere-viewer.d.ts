declare module 'photo-sphere-viewer' {
  export interface ViewerOptions {
    container: HTMLElement | string;
    panorama: string;
    caption?: string;
    navbar?: string[];
  }

  export default class PhotoSphereViewer {
    constructor(options: ViewerOptions);

    setPanorama(panorama: string, options?: { caption?: string }): Promise<void>;

    destroy(): void;
  }
}
