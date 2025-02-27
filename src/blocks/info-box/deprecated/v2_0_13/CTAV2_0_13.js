import { RichText } from '@wordpress/block-editor';
import classnames from 'classnames';
import renderSVG from '@Controls/renderIcon';
import { __ } from '@wordpress/i18n';

const CTAV2_0_13 = ( props ) => {
	const { attributes, setAttributes = 'not_set' } = props;

	const ctaBtnClass = 'uagb-infobox-cta-link wp-block-button__link';

	let target = '_self';
	const rel = 'noopener noreferrer';
	if ( attributes.ctaTarget ) {
		target = '_blank';
	}

	let ctaIconOutput = '';
	if ( attributes.ctaIcon !== '' ) {
		ctaIconOutput = renderSVG( attributes.ctaIcon );
	}

	if ( setAttributes !== 'not_set' ) {
		return (
			<div className="uagb-ifb-cta">
				{ attributes.ctaType === 'text' && (
					<a // eslint-disable-line jsx-a11y/anchor-is-valid
						target={ target }
						className="uagb-infobox-cta-link"
						rel={ rel }
					>
						{ attributes.ctaIconPosition === 'before' && ctaIconOutput }
							<RichText
								tagName="span"
								placeholder={ __(
									'Read More',
									'ultimate-addons-for-gutenberg'
								) }
								value={ attributes.ctaText }
								className="uagb-inline-editing"
								multiline={ false }
								onChange={ ( value ) => {
									setAttributes( { ctaText: value } );
								} }
							/>
						{ attributes.ctaIconPosition === 'after' && ctaIconOutput }
					</a>
				) }

				{ attributes.ctaType === 'button' && (
					<div
						className={ classnames(
							'uagb-ifb-button-wrapper',
							'wp-block-button'
						) }
					>
						<a // eslint-disable-line jsx-a11y/anchor-is-valid
							className={ ctaBtnClass }
							target={ target }
							rel={ rel }
						>

							{ attributes.ctaIconPosition === 'before' && ctaIconOutput }
							<RichText
								tagName="span"
								placeholder={ __(
									'Read More',
									'ultimate-addons-for-gutenberg'
								) }
								value={ attributes.ctaText }
								className="uagb-inline-editing"
								multiline={ false }
								onChange={ ( value ) => {
									setAttributes( { ctaText: value } );
								} }
							/>
							{ attributes.ctaIconPosition === 'after' && ctaIconOutput }
						</a>
					</div>
				) }
			</div>
		);
	}
	return (
			<>
				<div className= 'uagb-ifb-button-wrapper wp-block-button' >
					{ attributes.ctaType === 'text' && (
						<a
							href={ attributes.ctaLink }
							target={ target }
							className="uagb-infobox-cta-link"
							rel={ rel }
							alt=""
						>
							{ attributes.ctaIconPosition === 'before' && ctaIconOutput }
							<RichText.Content
								tagName="span"
								value={ attributes.ctaText }
								className="uagb-inline-editing"
							/>
							{ attributes.ctaIconPosition === 'after' && ctaIconOutput }
						</a>
					) }
					{ attributes.ctaType === 'button' && (
						<a
							href={ attributes.ctaLink }
							className={ ctaBtnClass }
							target={ target }
							rel={ rel }
							alt=""
						>
							{ attributes.ctaIconPosition === 'before' && ctaIconOutput }
							<RichText.Content
								tagName="span"
								value={ attributes.ctaText }
								className="uagb-inline-editing"
							/>
							{ attributes.ctaIconPosition === 'after' && ctaIconOutput }
						</a>
					) }
				</div>
		</>
	);
};
export default CTAV2_0_13;
