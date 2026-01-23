export interface Settings {
  backgroundGrid: {
    type: "default" | "static" | "none";
    gridSize: number;
    lineWidth: number;
    baseOpacity: number;
    highlightIntensity: number;
    highlightSize: number;
  };
  globe: {
    rotationSpeed: number;
    lineWidth: number;
    meridians: number;
    parallels: number;
    acidity: number;
  };
  interaction: {
    mouseSensitivity: number;
    gyroscopeSensitivity: number;
  };
  audio: {
    flashbangOnLightMode: boolean;
  };
  performance: {
    lowPerformanceMode: "auto" | "on" | "off";
    showFpsCounter: boolean;
  };
  navigation: {
    showBreadcrumbs: boolean;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  cvss?: number;
  locked: boolean;
  affectedCompany: string | string[];
  description: string;
  imageUrl?: string;
}

export interface Project {
  id: string;
  number: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  tags: string[];
  icon: string;
}

export interface Skill {
  name: string;
  category: "engineering" | "security" | "tools";
}

export interface CodingStat {
  language: string;
  timeSpent: string;
  percentage: number;
  color: string;
}
