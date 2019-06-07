import { Helpers} from '@tradeshift/elements';

export const classNames = {
	fileCardWrapper: 'file-card-wrapper',
	actionIconWrapper: 'action-icon-wrapper',
	actionIcon: 'action-icon',
	removeAction: 'remove-action',
	removeActionHovered: 'remove-action-hovered',
	removeActionMessage: 'remove-action-message',
	downloadAction: 'download-action',
	downloadActionHovered: 'download-action-hovered',
	downloadActionMessage: 'download-action-message',
	textContent: 'content',
	fileIconWrapper: 'file-icon-wrapper',
	fileIcon: 'file-icon',
	fileInformation: 'file-information',
	errorMessage: 'error-message',
	progressBar: 'progress-bar'
};

const selectors = {
	...Helpers.classNamesToSelector(classNames)
};


export default selectors;
