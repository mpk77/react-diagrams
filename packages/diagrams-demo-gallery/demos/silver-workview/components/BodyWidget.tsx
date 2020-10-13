import * as React from 'react';
import * as _ from 'lodash';
import { TrayWidget } from './TrayWidget';
import { Application } from '../Application';
import { TrayItemWidget } from './TrayItemWidget';
import { DefaultNodeModel, DiagramModel, PortModelAlignment } from '@projectstorm/react-diagrams';
import { BaseEvent, CanvasWidget, DeleteItemsAction } from '@projectstorm/react-canvas-core';
import { DemoCanvasWidget } from '../../helpers/DemoCanvasWidget';
import styled from '@emotion/styled';
import { SimplePortFactory } from '../../diamond/SimplePortFactory';
import { DiamondNodeFactory } from '../../diamond/DiamondNodeFactory';
import { DiamondPortModel } from '../../diamond/DiamondPortModel';
import { DiamondNodeModel } from '../../diamond/DiamondNodeModel';
import { action } from '@storybook/addon-actions';
import * as beautify from 'json-beautify';
import { DemoWorkspaceWidget, DemoButton } from '../../helpers/DemoWorkspaceWidget';
import { AdvancedLinkFactory } from '../../demo-custom-link2';

export interface BodyWidgetProps {
	app: Application;
}

namespace S {
	export const Body = styled.div`
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		min-height: 100%;
	`;

	export const Header = styled.div`
		display: flex;
		background: rgb(30, 30, 30);
		flex-grow: 0;
		flex-shrink: 0;
		color: white;
		font-family: Helvetica, Arial, sans-serif;
		padding: 10px;
		align-items: center;
	`;

	export const Content = styled.div`
		display: flex;
		flex-grow: 1;
	`;

	export const Layer = styled.div`
		position: relative;
		flex-grow: 1;
	`;
}

export class BodyWidget extends React.Component<BodyWidgetProps> {

	componentDidMount() {
		// register an DeleteItemsAction with custom keyCodes (in this case, only Delete key)
		this.props.app.getDiagramEngine().getActionEventBus().registerAction(new DeleteItemsAction({ keyCodes: [46] }));
		this.props.app.getDiagramEngine().registerListener({
			eventDidFire: (event: BaseEvent) => {
				action(JSON.stringify(event));
			},
			eventWillFire: (event: BaseEvent) => {
				action(JSON.stringify(event));
			}
		});

		this.props.app.getDiagramEngine().getModel().registerListener({
			eventDidFire: action('model eventDidFire'),
			eventWillFire: action('model eventWillFire'),
		});
		var engine  = this.props.app.getDiagramEngine();
		engine.getLinkFactories().deregisterFactory('default');
		engine.getLinkFactories().registerFactory(new AdvancedLinkFactory('default'));
	}

	render() {
		return (
			<S.Body>
				<DemoWorkspaceWidget
					buttons={
						<>
							<DemoButton
								onClick={() => {
									action('Serialized Graph')(beautify(this.props.app.getDiagramEngine().getModel().serialize(), null, 2, 80));
								}}>
								Serialize Graph
						</DemoButton>
							<DemoButton
								onClick={() => {
									var model2 = new DiagramModel();
									var engine = this.props.app.getDiagramEngine();
									debugger;
									var layersData = engine.getModel().serialize();
									model2.deserializeModel(JSON.parse(JSON.stringify(layersData)), engine);
									engine.setModel(model2);

								}}>
								De-Serialize Graph
							</DemoButton>
						</>
					}>
				</DemoWorkspaceWidget>

				<S.Header>
					<div className="title">Storm React Diagrams - DnD demo</div>
				</S.Header>
				<S.Content>
					<TrayWidget>
						<TrayItemWidget model={{ type: 'in' }} name="In Node" color="rgb(192,255,0)" />
						<TrayItemWidget model={{ type: 'out' }} name="Out Node" color="rgb(0,192,255)" />
						<TrayItemWidget model={{ type: 'diamond' }} name="Diamond Node" color="rgb(0,192,255)" />
					</TrayWidget>
					<S.Layer
						onDrop={(event) => {
							var data = JSON.parse(event.dataTransfer.getData('storm-diagram-node'));
							var nodesCount = _.keys(this.props.app.getDiagramEngine().getModel().getNodes()).length;
							var engine = this.props.app.getDiagramEngine();
							var node = null;
							if (data.type === 'in') {
								node = new DefaultNodeModel('Node ' + (nodesCount + 1), 'rgb(192,255,0)');
								node.addInPort('In');
							} else if (data.type === 'out') {
								node = new DefaultNodeModel('Node ' + (nodesCount + 1), 'rgb(0,192,255)');
								node.addOutPort('Out');
							}
							else if (data.type === 'diamond') {
								// node = new DefaultNodeModel('Node ' + (nodesCount + 1), 'rgb(0,192,255)');
								// node.addOutPort('Out');
								// register some other factories as well
								engine
									.getPortFactories()
									.registerFactory(new SimplePortFactory('diamond', (config) => new DiamondPortModel(PortModelAlignment.LEFT)));
								engine.getNodeFactories().registerFactory(new DiamondNodeFactory());

								//3-B) create our new custom node
								node = new DiamondNodeModel('diamond', 80, 11);
								node.setPosition(250, 108);

							}
							var point = this.props.app.getDiagramEngine().getRelativeMousePoint(event);
							node.setPosition(point);
							this.props.app.getDiagramEngine().getModel().addNode(node);
							this.forceUpdate();
						}}
						onDragOver={(event) => {
							event.preventDefault();
						}}>
						<DemoCanvasWidget>
							<CanvasWidget engine={this.props.app.getDiagramEngine()} />
						</DemoCanvasWidget>
					</S.Layer>
				</S.Content>
			</S.Body>
		);
	}
}
