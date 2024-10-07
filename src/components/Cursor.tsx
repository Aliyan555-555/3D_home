import React, { useEffect } from 'react';
import * as BABYLON from 'babylonjs';

const Cursor: React.FC<{ scene: BABYLON.Scene | null; camera: BABYLON.Camera | null }> = ({ scene, camera }) => {
  useEffect(() => {
    if (!scene || !camera) return;

    // Create the cursor mesh with a larger size
    const cursorMesh = new BABYLON.MeshBuilder.CreatePlane("cursorPlane", { size: 2 }, scene); // Increase size if necessary
    const cursorMaterial = new BABYLON.PBRMaterial("cursorMaterial", scene);
    cursorMaterial.albedoTexture = new BABYLON.Texture("/images/UI/teleport.png", scene);
    cursorMaterial.albedoTexture.hasAlpha = true;
    cursorMaterial.metallic = 0;
    cursorMaterial.roughness = 1;

    cursorMesh.renderingGroupId = 1;
    cursorMesh.material = cursorMaterial;

    // Initially position the cursor in front of the camera
    cursorMesh.position = camera.position.clone();
    cursorMesh.position.z += 5; // Position it 5 units in front of the camera

    const adjustCursorPosition = (pickedInfo: BABYLON.PickingInfo) => {
      const pickedMesh = pickedInfo.pickedMesh;

      if (pickedMesh) {
        cursorMesh.position.copyFrom(pickedInfo.pickedPoint!); // Set the cursor position to the picked point

        // Ground interaction
        if (pickedMesh.name.includes("ground")) {
          const direction = camera.position.subtract(cursorMesh.position);
          cursorMesh.rotation.y = Math.atan2(direction.x, direction.z);
          cursorMesh.rotation.x = Math.PI / 2; // Ensure the plane is horizontal
        } 
        
        // Wall interaction
        else if (pickedMesh.metadata && pickedMesh.metadata.type === "wall") {
          cursorMesh.position.y += 1; // Raise the cursor for walls
          const direction = camera.position.subtract(cursorMesh.position);
          cursorMesh.rotation.y = Math.atan2(direction.x, direction.z); // Make the cursor face the camera
          cursorMesh.rotation.x = Math.PI / 2; // Keep the plane horizontal
        } 
        
        // Furniture interaction
        else if (pickedMesh.name.includes("sofa") || pickedMesh.name.includes("table")) {
          cursorMesh.position.y += 0.3; // Adjust height for furniture
        }
      }
    };

    const updateCursorPosition = () => {
      const pickInfo = scene.pick(scene.pointerX, scene.pointerY);
      if (pickInfo.hit) {
        adjustCursorPosition(pickInfo); // Adjust position based on what is hit
      } else {
        // Optional: Move the cursor off-screen if nothing is hit
        cursorMesh.position.set(0, -100, 0);
      }
    };

    // Update cursor position on pointer move
    scene.onPointerObservable.add((pointerInfo) => {
      if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERMOVE) {
        updateCursorPosition();
      }
    });

    // Clean up the cursor mesh when the component unmounts
    return () => {
      cursorMesh.dispose();
    };
  }, [scene, camera]);

  return null; // No visual component to render
};

export default Cursor;
