import { NodeModel, NodeModelGenerics, PortModelAlignment } from '@projectstorm/react-diagrams';
import { DiamondPortModel } from './DiamondPortModel';

export interface DiamondNodeModelGenerics {
	PORT: DiamondPortModel;
}

export class DiamondNodeModel extends NodeModel<NodeModelGenerics & DiamondNodeModelGenerics> {
	name: string;
	size: number;
	fontSize: number;
	constructor(
		name?: string,
		size?: number,
		fontSize?: number
	) {
		super({
			type: 'diamond',
			name
		});
		this.addPort(new DiamondPortModel(PortModelAlignment.TOP));
		this.addPort(new DiamondPortModel(PortModelAlignment.LEFT));
		this.addPort(new DiamondPortModel(PortModelAlignment.BOTTOM));
		this.addPort(new DiamondPortModel(PortModelAlignment.RIGHT));
		this.name = name;
		this.size = size || 80;
		this.fontSize = fontSize || 11;
	}
}
