// 扩展HTMLInputElement接口，添加directory相关属性
interface HTMLInputElement extends HTMLElement {
  webkitdirectory?: boolean | string;
  directory?: boolean | string;
  mozdirectory?: boolean | string;
} 