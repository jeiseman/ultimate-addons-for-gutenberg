/**
 * Returns Dynamic Generated CSS
 */

import generateCSS from '@Controls/generateCSS';

function styling() {

	let selectors = {};
	let tabletSelectors = {};
	let mobileSelectors = {};

	const spacing = uagb_blocks_info?.blocks_editor_spacing ? uagb_blocks_info.blocks_editor_spacing + 'px' : false;

	if ( ! spacing ) {
		return '';
	}

	const spacingCSS = {
		'margin-block-start' :  spacing,
		'margin-top' :  spacing,
	};

	selectors = {
		'.edit-post-visual-editor .editor-styles-wrapper .edit-post-visual-editor__post-title-wrapper > * + *:not(p), .edit-post-visual-editor .editor-styles-wrapper .block-editor-block-list__layout.is-root-container > * + *:not(p)': spacingCSS,

	};
	tabletSelectors = {
		'.editor-styles-wrapper > .block-editor-block-list__layout.is-root-container > .wp-block + .wp-block:not(p)': spacingCSS,

	};
	mobileSelectors = {
		'.editor-styles-wrapper > .block-editor-block-list__layout.is-root-container > .wp-block + .wp-block:not(p)': spacingCSS,

	};

	let stylingCss = '';

	stylingCss = generateCSS( selectors, '' );
	stylingCss += generateCSS(
		tabletSelectors,
		` `,
		true,
		'tablet'
	);

	stylingCss += generateCSS(
		mobileSelectors,
		` `,
		true,
		'mobile'
	);

	return stylingCss;
}

export default styling;
