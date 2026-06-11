export type Message = {
  id: string;
  sender: 'user' | 'bot' | 'loading';
  text: string;
  hasAttachment?: boolean;
};
 
export type AccessMode = 'none' | 'client' | 'guest';
 
export type Theme = 'light' | 'dark';
 
export type ModuleConfig = {
  name: string;
  hook: string;
  icon: string;
  demoText: string;
  loadingText: string;
};
