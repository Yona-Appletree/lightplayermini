import * as React from "react";
import { createRef } from "react";
import { SceneNode } from "../LiteScene";

import styles from './UiNode.module.scss';
import { inputDefDefaultValue, LiteInputDef } from "../LiteInput";
import { LiteScalar, LiteVector } from "../LiteValue";

export interface UiNodeLayoutProps {
  node: SceneNode<any>
}

export function UiNode({node}: UiNodeLayoutProps) {
  return <div className={styles.UiNode}
              style={{
                left: node.uiPos.x + "px",
                top: node.uiPos.y + "px",
              }}
  >
    <div className={styles.UiNode_Header}>
      <div className={styles.UiNode_Header_Title}>
        {node.id}
      </div>
    </div>

    <div className={styles.UiNode_Inputs}>
      {
        Object.entries(node.def.inputs).map(([inputName, inputDef]) =>
          <UiNodeInput node={node} inputName={inputName} inputDef={inputDef as LiteInputDef}></UiNodeInput>
        )
      }
    </div>

    <div className={styles.UiNode_Outputs}>
      {
        Object.entries(node.def.outputs).map(([outputName, outputDef]) =>
          <div>
            {outputName}
          </div>
        )
      }
    </div>

    <div className={styles.UiNode_Detail}>
      {node.customUi()}
    </div>
  </div>
}

interface UiNodeInputProps {
  node: SceneNode<any>,
  inputName: string,
  inputDef: LiteInputDef
}

function UiNodeInput(props: UiNodeInputProps){
  const {node, inputName, inputDef} = props

  const inputTypeRec: Record<LiteInputDef['type'], () => JSX.Element>  = {
    any: () => <></>,
    function: () => <></>,
    scalar: () => {
      const ref = createRef<HTMLInputElement>()

      return <input ref={ref}
        size={4}
        value={node.inputConstants[inputName]?.asString().value ?? ''}
        placeholder={inputDefDefaultValue(inputDef).asString().value }
        onChange={() => node.inputConstants[inputName] = LiteScalar.parse(ref.current?.value ?? '') ?? undefined}
      /> },
    array: () => <></>,
    vector: () => {
      const refX = createRef<HTMLInputElement>()
      const refY = createRef<HTMLInputElement>()
      const refZ = createRef<HTMLInputElement>()
      const refA = createRef<HTMLInputElement>()

      const defValue = inputDefDefaultValue(inputDef).asVector()
      const curValue = node.inputConstants[inputName]?.asVector()

      const handleUpdate = () => {
        const newX = parseFloat(refX.current?.value ?? '')
        const newY = parseFloat(refY.current?.value ?? '')
        const newZ = parseFloat(refZ.current?.value ?? '')
        const newA = parseFloat(refA.current?.value ?? '')

        node.inputConstants[inputName] = new LiteVector(
          isNaN(newX) ? defValue.x : newX,
          isNaN(newY) ? defValue.y : newY,
          isNaN(newZ) ? defValue.z : newZ,
          isNaN(newA) ? defValue.a : newA,
        )
      }

      return <>
        <input ref={refX}
               size={4}
               value={refX.current?.value ?? curValue?.x ?? ''}
               placeholder={String(defValue.x)}
               onChange={handleUpdate}
        />
        <input ref={refY}
               size={4}
               value={refY.current?.value ?? curValue?.y ?? ''}
               placeholder={String(defValue.y)}
               onChange={handleUpdate}
        />
        <input ref={refZ}
               size={4}
               value={refZ.current?.value ?? curValue?.z ?? ''}
               placeholder={String(defValue.z)}
               onChange={handleUpdate}
        />
        <input ref={refA}
               size={4}
               value={refA.current?.value ?? curValue?.a ?? ''}
               placeholder={String(defValue.a)}
               onChange={handleUpdate}
        />
      </>
    },
  }

  return <>
    <div className={styles.UiNodeInput_Label}>
      { inputName }
    </div>

    <div className={styles.UiNodeInput_Value}>
      { inputTypeRec[inputDef.type]() }
    </div>
  </>
}
