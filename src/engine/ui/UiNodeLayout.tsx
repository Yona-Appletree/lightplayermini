import * as React from "react";
import { SceneNode } from "../NodeScene";

export interface UiNodeLayoutProps {
	node: SceneNode<any>
}

export function UiNodeLayout({node}: UiNodeLayoutProps) {
	return <div>
		<div>
			{ node.id }
		</div>


	</div>
}
