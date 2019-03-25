import { TSElement, unsafeCSS, html } from '@tradeshift/elements';
import css from './tooltip.css';

customElements.define(
	'ts-tooltip',
	class extends TSElement {
		static get styles() {
			return [TSElement.styles, unsafeCSS(css)];
		}

		static get properties() {
			return {
				tooltip: { type: String, reflect: true },
				position: { type: String, reflect: true },
				width: { type: String, reflect: true }
			};
		}

		constructor() {
			super();
			this.tooltip = '';
			this.position = 'right';
			this.width = 'max-content';
		}

		render() {
			return html`
				<style>
					:host::before {
						width: ${this.width};
					}
				</style>
				<div>
					<slot></slot>
				</div>
			`;
		}
	}
);
