import './styles.css';
import m from "mithril";
import { Layout } from './Layout';

const app = document.querySelector<HTMLDivElement>('#app')!;

m.mount(app, Layout);
