declare module "*.module.scss";
declare module "*.module.css";
declare module "*.svg" {
  const content: string;
  export default content;
}