/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "d-aut": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "use-dev"?: boolean;
        "menu-items"?: string;
        "flow-config"?: string;
        "ipfs-gateway"?: string;
      };
    }
  }
}
