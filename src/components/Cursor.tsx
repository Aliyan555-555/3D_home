import React, { useEffect } from 'react';
import * as BABYLON from 'babylonjs';

const Cursor: React.FC<{ scene: BABYLON.Scene | null; camera: BABYLON.Camera | null }> = ({ scene, camera }) => {
  useEffect(() => {
    if (!scene || !camera) return;

    const cursorMesh = new BABYLON.MeshBuilder.CreatePlane("cursorPlane", { size: 40 }, scene);
    const cursorMaterial = new BABYLON.PBRMaterial("cursorMaterial", scene);
    cursorMaterial.albedoTexture = new BABYLON.Texture("/images/UI/teleport.png", scene);
    cursorMaterial.albedoTexture.hasAlpha = true;
    cursorMaterial.metallic = 0;
    cursorMaterial.roughness = 1;

    cursorMesh.renderingGroupId = 1;
    cursorMesh.material = cursorMaterial;

    const adjustCursorPosition = (pickedInfo: BABYLON.PickingInfo) => {
      const pickedMesh = pickedInfo.pickedMesh;

      if (pickedMesh) {
        cursorMesh.position.copyFrom(pickedInfo.pickedPoint!);

        if (pickedMesh.name.includes("Ground")) {
          const direction = camera.position.subtract(cursorMesh.position);
          cursorMesh.rotation.y = Math.atan2(direction.x, direction.z);
          cursorMesh.rotation.x = Math.PI / 2; // Ensure the plane is horizontal
          cursorMesh.position.y += 0.1;
        } else if (pickedMesh.metadata && pickedMesh.metadata.type === "wall") {
          cursorMesh.position.y += 1;
          const direction = camera.position.subtract(cursorMesh.position);
          cursorMesh.rotation.z = Math.PI / 2;
        } else if (pickedMesh.name.includes("Sofa") || pickedMesh.name.includes("Table")) {
          cursorMesh.position.y += 0.3;
        }
      }
    };

    const updateCursorPosition = () => {
      const pickInfo = scene.pick(scene.pointerX, scene.pointerY);
      if (pickInfo.hit) {
        adjustCursorPosition(pickInfo);
      }
    };

    let lastUpdateTime = 0;
    const updateInterval = 30;

    scene.onPointerObservable.add((pointerInfo) => {
      if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERMOVE) {
        const currentTime = performance.now();
        if (currentTime - lastUpdateTime > updateInterval) {
          updateCursorPosition();
          lastUpdateTime = currentTime;
        }
      }
    });

    const rotateCursor = () => {
      if (camera && cursorMesh) {
       
      }
    };

    scene.registerBeforeRender(() => {
      rotateCursor();
    });

    return () => {
      cursorMesh.dispose();
    };
  }, [scene, camera]);

  return null;
};

export default Cursor;
