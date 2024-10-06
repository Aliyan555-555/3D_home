import React, { useEffect } from 'react';
import * as BABYLON from 'babylonjs';

const Cursor: React.FC<{ scene: BABYLON.Scene | null; camera: BABYLON.Camera | null }> = ({ scene, camera }) => {
  useEffect(() => {
    if (!scene || !camera) return;

    // Create the cursor mesh
    const cursorMesh = new BABYLON.MeshBuilder.CreatePlane("cursorPlane", { size: 40 }, scene);
    const cursorMaterial = new BABYLON.PBRMaterial("cursorMaterial", scene);
    cursorMaterial.albedoTexture = new BABYLON.Texture("/images/UI/teleport.png", scene);
    cursorMaterial.albedoTexture.hasAlpha = true;
    cursorMaterial.metallic = 0;
    cursorMaterial.roughness = 1;

    cursorMesh.renderingGroupId = 1; // Render cursor after other objects
    cursorMesh.material = cursorMaterial;

    const adjustCursorPosition = (pickedInfo: BABYLON.PickingInfo) => {
      const pickedMesh = pickedInfo.pickedMesh;

      if (pickedMesh) {
        // Adjust the cursor position based on the type of surface
        cursorMesh.position.copyFrom(pickedInfo.pickedPoint!);

        if (pickedMesh.name.includes("Ground")) {
          cursorMesh.position.y += 0.1; // Hover slightly above the ground
        }else if (pickedMesh.metadata && pickedMesh.metadata.type === "wall") {console.log(cursorMash)
            cursorMesh.position.y += 1;
            cursorMesh.rotation.z= Math.PI / 2; // Rotate the cursor by 90 degrees (π/2 radians)
        }
        else if (pickedMesh.name.includes("Sofa") || pickedMesh.name.includes("Table")) {
          cursorMesh.position.y += 0.3; // Higher for furniture
        }
      }
    };

    const updateCursorPosition = () => {
      const pickInfo = scene.pick(scene.pointerX, scene.pointerY);
      if (pickInfo.hit) {
        adjustCursorPosition(pickInfo); // Call the function to adjust position
      }
    };

    // Throttle the pointer move event to improve performance
    let lastUpdateTime = 0;
    const updateInterval = 30; // Update every 30ms

    scene.onPointerObservable.add((pointerInfo) => {
      if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERMOVE) {
        const currentTime = performance.now();
        if (currentTime - lastUpdateTime > updateInterval) {
          updateCursorPosition();
          lastUpdateTime = currentTime;
        }
      }
    });

    // Function to make the cursor always face the camera
    const rotateCursor = () => {
      if (camera && cursorMesh) {
        cursorMesh.lookAt(camera.position); // Make cursor face the camera
        cursorMesh.rotation.x = Math.PI / 2; // Ensure the plane is horizontal
      }
    };

    // Register the before render event
    scene.registerBeforeRender(() => {
      rotateCursor(); // Update cursor rotation each frame
    });

    return () => {
      cursorMesh.dispose(); // Clean up on component unmount
    };
  }, [scene, camera]);

  return null; // Return null as we're using Babylon.js to render the cursor
};

export default Cursor;
