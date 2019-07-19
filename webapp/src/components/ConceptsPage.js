import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import {withRouter} from 'react-router-dom';
import {withRfcContext} from '../contexts/RfcContext';
import Typography from '@material-ui/core/Typography';
import {ShapeEditorStore} from '../contexts/ShapeEditorContext.js';
import {ShapesCommands} from '../engine';
import {routerUrls} from '../routes.js';
import {FullSheet} from './navigation/Editor.js';
import {withEditorContext} from '../contexts/EditorContext';
import ContributionTextField from './contributions/ContributionTextField';
import {updateContribution} from '../engine/routines';
import Editor from './navigation/Editor';
import {track} from '../Analytics';
import Helmet from 'react-helmet';
import ShapeViewer from './shape-editor/ShapeViewer.js';

const styles = theme => ({
    root: {
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 15
    },
    shapeEditorContainer: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#f8f8f8'
    }
});

class ConceptsPage extends React.Component {
    renderMissing() {
        const {classes} = this.props
        return (
            <Editor>
                <FullSheet>
                    <div className={classes.root}>
                        <Typography>This Concept does not exist</Typography>
                    </div>
                </FullSheet>
            </Editor>
        )
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.conceptId !== this.props.conceptId) {
            track('Loaded Concept')
        }
    }


    render() {
        const {history, baseUrl, classes, conceptId, handleCommand, mode, cachedQueryResults, queries, apiName} = this.props;
        const {contributions} = cachedQueryResults;

        let shape = null;
        try {
            shape = queries.shapeById(conceptId);
        } catch (e) {
            console.error(e)
            return this.renderMissing()
        }

        return (
            <Editor>
                <Helmet><title>{shape.name} -- {apiName}</title></Helmet>
                <FullSheet>
                    <div className={classes.root}>
                        <ContributionTextField
                            key={`${conceptId}-name`}
                            value={shape.name}
                            variant={'heading'}
                            placeholder={'Concept Name'}
                            mode={mode}
                            onBlur={(value) => {
                                const command = ShapesCommands.RenameShape(conceptId, value)
                                handleCommand(command)
                            }}
                        />

                        <ContributionTextField
                            key={`${conceptId}-description`}
                            value={contributions.getOrUndefined(conceptId, 'description')}
                            variant={'multi'}
                            placeholder={'Description'}
                            mode={mode}
                            onBlur={(value) => {
                                handleCommand(updateContribution(conceptId, 'description', value));
                            }}
                        />
                        <div className={classes.shapeEditorContainer}>
                            <ShapeEditorStore onShapeSelected={(shapeId) => {
                                history.push(routerUrls.conceptPage(baseUrl, shapeId))
                            }}>
                                <ShapeViewer shape={shape}/>
                            </ShapeEditorStore>
                        </div>
                    </div>
                </FullSheet>
            </Editor>
        );
    }
}

export default withRouter(withEditorContext(withRfcContext(withStyles(styles)(ConceptsPage))));
