export interface MenuItem {
  id: string;
  label: string;
  route?: string; // Added this so the router knows where to go
  icon?: string;
}