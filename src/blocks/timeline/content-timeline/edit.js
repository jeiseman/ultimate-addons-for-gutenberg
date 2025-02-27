/**
 * BLOCK: Content Timeline.
 */

import contentTimelineStyle from './styling';
import { useEffect } from '@wordpress/element';
import { dispatch, select } from '@wordpress/data';
import { useDeviceType } from '@Controls/getPreviewType';
import addBlockEditorDynamicStyles from '@Controls/addBlockEditorDynamicStyles';
import scrollBlockToView from '@Controls/scrollBlockToView';
import Settings from './settings';
import Render from './render';
import responsiveConditionPreview from '@Controls/responsiveConditionPreview';
import WebfontLoader from '@Components/typography/fontloader';

const ContentTimelineComponent = ( props ) => {
    const deviceType = useDeviceType();
    const {
		setAttributes,
		clientId,
		attributes,
		attributes: {
			timelinAlignmentTablet,
			timelinAlignmentMobile,
			stack,
			UAGHideDesktop,
			UAGHideTab,
			UAGHideMob,
			headLoadGoogleFonts,
			headFontFamily,
			headFontWeight,
			subHeadLoadGoogleFonts,
			subHeadFontFamily,
			subHeadFontWeight,
			dateLoadGoogleFonts,
			dateFontFamily,
			dateFontWeight,
		},
		isSelected,
	} = props;

    useEffect( () => {

        // Replacement for componentDidMount.
        //Store client id.
        setAttributes( { block_id: clientId } );
        setAttributes( { classMigrate: true } );
        setAttributes( { childMigrate: true } );

        if( attributes.timelinAlignment ) {
            if( 'none' === stack ) {
                if( undefined === timelinAlignmentTablet ) {
                    setAttributes( { timelinAlignmentTablet: attributes.timelinAlignment } );
                }
                if( undefined === timelinAlignmentMobile ) {
                    setAttributes( { timelinAlignmentMobile: attributes.timelinAlignment } );
                }
            } else {
                if( undefined === timelinAlignmentTablet && 'tablet' === stack ) {
                    setAttributes( { timelinAlignmentTablet: 'left' } );
                    setAttributes( { timelinAlignmentMobile: 'left' } );
                }

                if( undefined === timelinAlignmentMobile && 'mobile' === stack ) {
                    setAttributes( { timelinAlignmentMobile: 'left' } );
                    setAttributes( { timelinAlignmentTablet: attributes.timelinAlignment } );
                }
            }
        }
		

    }, [] );

    useEffect( () => {
        // Replacement for componentDidUpdate.
        const blockStyling = contentTimelineStyle( props );

        addBlockEditorDynamicStyles( 'uagb-content-timeline-style-' + clientId.substr( 0, 8 ), blockStyling );
        if (
            null ===
            select( 'core/block-editor' ).getBlocksByClientId(
                clientId
            )[0]
        ) {
            return;
        }

        let device = deviceType;

        // For desktop, attribute name does not have `desktop` suffix to support backward compatibility.
        if( 'Desktop' === deviceType ) {
            device = '';
        }

        const timelinAlignment = 'undefined' !== typeof attributes['timelinAlignment' + device ] ? attributes['timelinAlignment' + device ] : attributes.timelinAlignment;

        select( 'core/block-editor' )
            .getBlocksByClientId( clientId )[0]
            .innerBlocks.forEach( function( block, key ) {

                let alignClass = '';
                if ( 'left' === timelinAlignment ) {
                    alignClass = 'uagb-timeline__left';
                } else if ( 'right' === timelinAlignment ) {
                    alignClass = 'uagb-timeline__right';
                } else if ( 'center' === timelinAlignment ) {
                    if ( key % 2 === 0 ) {
                        alignClass =
                            'uagb-timeline__right';
                    } else {
                        alignClass =
                            'uagb-timeline__left';
                    }
                }

                let dayAlignClass = '';
                if ( 'left' === timelinAlignment ) {
                    dayAlignClass =
                        'uagb-timeline__day-new uagb-timeline__day-left';
                } else if ( 'right' === timelinAlignment ) {
                    dayAlignClass =
                        'uagb-timeline__day-new uagb-timeline__day-right';
                } else if ( 'center' === timelinAlignment ) {
                    if ( key % 2 === 0 ) {
                        dayAlignClass =
                            'uagb-timeline__day-new uagb-timeline__day-right';
                    } else {
                        dayAlignClass =
                            'uagb-timeline__day-new uagb-timeline__day-left';
                    }
                }

                dispatch( 'core/block-editor' ).updateBlockAttributes(
                    block.clientId, {
                        content_class: alignClass,
                    }
                );
                dispatch( 'core/block-editor' ).updateBlockAttributes(
                    block.clientId, {
                        dayalign_class: dayAlignClass,
                    }
                );
            } );
        const getChildBlocks = select( 'core/block-editor' ).getBlocks(
            clientId
        );
        getChildBlocks.forEach( ( ctChild ) => {
            ctChild.attributes.headingTag = attributes.headingTag;
            ctChild.attributes.dateFormat = attributes.dateFormat;
        } );
		
    }, [ props, deviceType ] );
    
	useEffect( () => {

		responsiveConditionPreview( props );

	}, [ UAGHideDesktop, UAGHideTab, UAGHideMob, deviceType ] );

    useEffect( () => {
		scrollBlockToView();
	}, [deviceType] );

	// Load all the Google Fonts for The Content Timeline Block.
	let loadHeadGoogleFonts;
	let loadSubHeadGoogleFonts;
	let loadDateGoogleFonts;

	if ( headLoadGoogleFonts === true ) {
		const headconfig = {
			google: {
				families: [
					headFontFamily +
						( headFontWeight ? ':' + headFontWeight : '' ),
				],
			},
		};
		loadHeadGoogleFonts = (
			<WebfontLoader config={ headconfig }></WebfontLoader>
		);
	}

	if ( subHeadLoadGoogleFonts === true ) {
		const subHeadconfig = {
			google: {
				families: [
					subHeadFontFamily +
						( subHeadFontWeight ? ':' + subHeadFontWeight : '' ),
				],
			},
		};
		loadSubHeadGoogleFonts = (
			<WebfontLoader config={ subHeadconfig }></WebfontLoader>
		);
	}

	if ( dateLoadGoogleFonts === true ) {
		const dateconfig = {
			google: {
				families: [
					dateFontFamily +
						( dateFontWeight ? ':' + dateFontWeight : '' ),
				],
			},
		};
		loadDateGoogleFonts = (
			<WebfontLoader config={ dateconfig }></WebfontLoader>
		);
	}

    return (
		<>
			{ isSelected && <Settings parentProps={ props } /> }
			<Render parentProps={ props } />
			{ loadHeadGoogleFonts }
			{ loadSubHeadGoogleFonts }
			{ loadDateGoogleFonts }
		</>
	);
};

export default ContentTimelineComponent;
