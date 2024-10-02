"use client";
import React, { useEffect, useRef, useState } from "react";
import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
import 'babylonjs-gui'

const BabylonScene = () => {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const sceneRef = useRef(null);
  const [currentPoint, setCurrentPoint] = useState(2); // State to keep track of the current navigation point
  const [initialLoading, setInitialLoading] = useState(true); // State to manage initial loading
  const [navigationLoading, setNavigationLoading] = useState(false); // State to manage navigation loading
  const [placeholderSkybox, setPlaceholderSkybox] = useState(null); // State to manage placeholder skybox
  const [cameraPosition, setCameraPosition] = useState({ x: 0, z: 0 }); // State to manage camera position for the mini-map

  const createScene = () => {
    const scene = new BABYLON.Scene(engineRef.current);

    // Set up the camera for panoramic view
    const camera = new BABYLON.ArcRotateCamera(
      "Camera",
      Math.PI / 2,
      Math.PI / 2,
      110,
      BABYLON.Vector3.Zero(),
      scene
    );
    camera.attachControl(canvasRef.current, true);
    camera.inputs.attached.mousewheel.detachControl(canvasRef.current); // Disable mouse wheel zoom

    // Adjust camera settings for smoother movement
    camera.inertia = 0.5; // Controls the inertia of the camera movement
    camera.angularSensibility = 500; // Higher values make the camera less sensitive to mouse movements
    camera.wheelDeltaPercentage = -1; // Set a smaller value for less sensitivity

    // Add ambient light for better illumination
    const ambientLight = new BABYLON.HemisphericLight(
      "ambientLight",
      new BABYLON.Vector3(0, 1, 0),
      scene
    );
    ambientLight.intensity = 0.5; // Adjust intensity

    // Add directional light
    const light = new BABYLON.DirectionalLight(
      "light",
      new BABYLON.Vector3(0, -1, 0),
      scene
    );
    light.position = new BABYLON.Vector3(0, 10, 0);
    light.intensity = 1; // Adjust intensity

    // Create a placeholder skybox
    const placeholderSkybox = BABYLON.MeshBuilder.CreateBox(
      "placeholderSkyBox",
      { size: 1000.0 },
      scene
    );
    const placeholderSkyboxMaterial = new BABYLON.StandardMaterial(
      "placeholderSkyBox",
      scene
    );
    placeholderSkyboxMaterial.backFaceCulling = false;
    placeholderSkyboxMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    placeholderSkyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    placeholderSkybox.material = placeholderSkyboxMaterial;
    setPlaceholderSkybox(placeholderSkybox);

    // Update camera position state on camera position change
    scene.registerBeforeRender(() => {
      const cameraPosition = camera.position;
      setCameraPosition({ x: cameraPosition.x, z: cameraPosition.z });
    });

    return scene;
  };

  const loadPanoramaImages = async (point) => {
    setNavigationLoading(true); // Set navigation loading to true before starting to load images
    const folderPath = `/images/point${point}/`;
    const cubeTexture = new BABYLON.CubeTexture(folderPath, sceneRef.current, [
      "_px.jpg",
      "_nx.jpg",
      "_py.jpg",
      "_ny.jpg",
      "_pz.jpg",
      "_nz.jpg",
    ]);

    await new Promise((resolve) => {
      cubeTexture.onLoadObservable.add(() => {
        resolve();
      });
    });

    // Create a skybox
    const skybox = BABYLON.MeshBuilder.CreateBox(
      "skyBox",
      { size: 1000.0 },
      sceneRef.current
    );
    const skyboxMaterial = new BABYLON.StandardMaterial(
      "skyBox",
      sceneRef.current
    );
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = cubeTexture;
    skyboxMaterial.reflectionTexture.coordinatesMode =
      BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;

    // Dispose of the placeholder skybox after the panorama images are loaded
    if (placeholderSkybox) {
      placeholderSkybox.dispose();
      setPlaceholderSkybox(null);
    }

    setNavigationLoading(false); // Set navigation loading to false after images are loaded

    return skybox;
  };
  const manager = new BABYLON.GUI.GUI3DManager(scene);
  // const button = new BABYLON.GUI.Button3D("teleport");
    // manager.addControl(button);
    // button.mesh.material.specularPower = 0
    // button.mesh.material.diffuseColor.set(0.25, 0.25, 0.25)

  useEffect(() => {
    engineRef.current = new BABYLON.Engine(canvasRef.current, true);
    sceneRef.current = createScene();

    loadPanoramaImages(currentPoint).then(() => {
      setInitialLoading(false); // Set initial loading to false after initial images are loaded
    });

    engineRef.current.runRenderLoop(() => {
      sceneRef.current.render();
    });

    window.addEventListener("resize", () => {
      engineRef.current.resize();
    });

    return () => {
      window.removeEventListener("resize", () => engineRef.current.resize());
      engineRef.current.dispose();
    };
  }, []);

  useEffect(() => {
    if (sceneRef.current && !initialLoading) {
      // Remove the existing skybox
      sceneRef.current.meshes.forEach((mesh) => {
        if (mesh.name === "skyBox") {
          mesh.dispose();
        }
      });

      loadPanoramaImages(currentPoint);
    }
  }, [currentPoint]);

  return (
    <div>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100vh" }} />
      {initialLoading && (
        <div className="w-screen h-screen fixed top-0 left-0">
          <img
            className={"w-screen object-cover h-screen"}
            src="/images/UI/splashscreen.jpg"
            alt="splashscreen"
          />
        </div>
      )}
      {navigationLoading && (
        <div
          className="fixed top-0 flex items-center justify-center left-0 w-screen bg-no-repeat bg-cover h-screen "
          style={{ backgroundImage: `url(/images/UI/splashscreen.jpg)` }}
        >
          <img
            className="animate-spin"
            src="/images/UI/loading.png"
            alt="LOADING"
          />
        </div>
      )}
      <div style={{ position: "absolute", top: 10, left: 10 }}>
        {Array.from({ length: 9 }, (_, i) => (
          <button key={i + 1} onClick={() => setCurrentPoint(i + 1)}>
            Point {i + 1}
          </button>
        ))}
      </div>
      <MiniMap
        url={`/images/UI/minimap.png`} // Path to your mini-map image
        cursor="/images/UI/user.png" // Path to your cursor image
        offsetX={0} // Default offsetX
        offsetY={0} // Default offsetY
        scale={1} // Default scale
        currentPosition={cameraPosition} // Pass current camera position to the mini-map
      />
    </div>
  );
};

export default BabylonScene;
// import React, { useEffect, useRef, useState } from "react";

const MiniMap = ({ url, cursor, currentPosition, scale = 1, offsetX = 0, offsetY = 0 }) => {
  const miniMapRef = useRef(null);
  const [miniMapStyle, setMiniMapStyle] = useState({ left: "0px", top: "0px", transform: "rotate(0rad)" });
  const [floor, setFloor] = useState(null); // Store the current floor if applicable

  useEffect(() => {
    if (miniMapRef.current) {
      const { left, top } = calculateMiniMapPosition(currentPosition);
      setMiniMapStyle({ left, top });
    }
  }, [currentPosition]);

  const calculateMiniMapPosition = (position) => {
    const x = (position.x + offsetX) * scale; // Adjust for offset and scale
    const y = (-position.z + offsetY) * scale; // Invert z for correct orientation
    return {
     rotate:`${x+y}.rad`
    };
  };

  const changeFloor = (newFloor) => {
    // Handle floor change logic
    setFloor(newFloor);
    // Update background image if necessary
    // Example: setBackgroundImage(newFloor.minimapUrl)
  };

  return (
    <div id="mini-map" ref={miniMapRef} style={styles.miniMap}>
      <div
        className="mini-map-image"
        style={{
          ...styles.miniMapImage,
          backgroundImage: `url(${floor ? floor.minimapUrl : url})`,
        }}
      >
        <div
          className="mini-map-position"
          style={{
            ...styles.miniMapPosition,
            ...miniMapStyle,
            backgroundImage: `url(${cursor})`,
          }}
        />
      </div>
      {floor && (
        <div className="changeFloorBtnContainer">
          {/* Render floor change buttons */}
          {Object.keys(floor).map((key) => (
            <div
              key={key}
              className={`changeFloorBtn ${floor[key].active ? 'active' : ''}`}
              onClick={() => changeFloor(floor[key])}
            >
              {floor[key].label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  miniMap: {
    position: "fixed",
    display: "block",
    bottom: "5px",
    right: "5px",
    width: "200px",
    height: "200px",
    padding: "10px",
    backgroundColor: "rgba(0, 0, 0, 0.50)",
    borderRadius: "0 0 3px 3px",
    overflow: "hidden",
  },
  miniMapImage: {
    position: "relative",
    display: "block",
    width: "200px",
    height: "200px",
    backgroundSize: "200px 200px",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    cursor: "pointer",
  },
  miniMapPosition: {
    position: "absolute",
    width: "64px",
    height: "59px",
    backgroundPosition: "center",
    backgroundSize: "64px",
  },
};

// export default MiniMap;
