import './styles.css';
import m from "mithril";
import { Layout } from './components/Layout';

const app = document.querySelector<HTMLDivElement>('#app')!;

m.mount(app, Layout);
