import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ThreeCanvas from "./ThreeCanvas";
import VoxelDisplay from "./VoxelDisplay";
import VoxelSliceDisplay from "./VoxelSliceDisplay";

const App = () => {
    return <>
        <ThreeCanvas width={800} height={800}></ThreeCanvas>
        {/*<VoxelDisplay width={800} height={800}></VoxelDisplay>*/}
        {/*<VoxelSliceDisplay></VoxelSliceDisplay>*/}
    </>;
};

ReactDOM.render(<App />, document.body);


