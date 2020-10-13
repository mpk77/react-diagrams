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
		this.name = this.options.extras?.name || name;
		this.size = this.options.extras?.size || size || 80;
		this.fontSize = this.options.extras?.fontSize || fontSize || 11;
		this.options.extras = {
			size: this.size,
			fontSize: this.fontSize,
			name: this.name
		};
	}
}
