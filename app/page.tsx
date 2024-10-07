"use client";
import React, { useEffect, useRef, useState } from "react";
import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
import "babylonjs-gui";
import Image from 'next/image';
import MiniMap from '@/src/components/MiniMap';
import {footPrintDatas} from '@/src/constants';
import {FootprintInterface} from '@/src/types';
import Cursor from '@/src/components/Cursor'
const BabylonScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<BABYLON.Engine | null>(null);
  let footprints: BABYLON.Mesh[] = [];
  const sceneRef = useRef<BABYLON.Scene | null>(null);
  const [currentPoint, setCurrentPoint] = useState(2); 
  const [initialLoading, setInitialLoading] = useState(true); 
  const [navigationLoading, setNavigationLoading] = useState(false); 
  const [cameraPosition, setCameraPosition] = useState({ x: 0, z: 0 });
  const footprintData: { [key: number]: FootprintInterface[] } = footPrintDatas;
    
 
  const moveCameraToFootprint = (footprint: FootprintInterface) => {
    if (!sceneRef.current) return;

    const camera = sceneRef.current.activeCamera as BABYLON.ArcRotateCamera;
    
    const targetPosition = footprint.position.add(new BABYLON.Vector3(0, 10, 0)); 
    const cameraAnimation = new BABYLON.Animation(
      "cameraAnimation",
      "position",
      30, // Frame rate
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    const keys = [
      { frame: 0, value: camera.position },
      { frame: 50, value: targetPosition },
    ];

    cameraAnimation.setKeys(keys);
    camera.animations.push(cameraAnimation);


    sceneRef.current.beginAnimation(camera, 0, 30, false, 1, () => {
      setCurrentPoint(footprint.point);
    });
  };


  const addFootprints = (scene: BABYLON.Scene | undefined, point: number) => {
    console.log("update point",point)
    if (!scene) return;

    // Dispose of existing footprints
    footprints.forEach((mesh) => mesh.dispose());
    footprints = []; // Clear the footprints array
    if (footprints.length > 0){
      footprints = []
    }

    const footprintsData = footprintData[point] || [];
    const footprintTexture = new BABYLON.Texture("/images/UI/hotspot_goto.png", scene);

    footprintsData.forEach((footprint) => {
      const footprintMesh = BABYLON.MeshBuilder.CreatePlane("footprint", { size: footprint.size }, scene);
      footprintMesh.position = footprint.position;
      footprintMesh.rotation.y = footprint.rotation;
      footprintMesh.rotation.x = Math.PI / 2;

      const footprintMaterial = new BABYLON.StandardMaterial("footprintMaterial", scene);
      footprintMaterial.diffuseTexture = footprintTexture;
      footprintMaterial.opacityTexture = footprintTexture;
      footprintMaterial.backFaceCulling = false;
      footprintMesh.material = footprintMaterial;

      footprintMesh.actionManager = new BABYLON.ActionManager(scene);
      footprintMesh.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
          setCurrentPoint(footprint.point);
          moveCameraToFootprint(footprint)
        })
      );

      footprints.push(footprintMesh); // Add footprint mesh to the array
    });
  };
  const createScene = () => {
    const scene = new BABYLON.Scene(engineRef.current!);
    const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 110,new BABYLON.Vector3(0,0,0), scene);
    camera.attachControl(canvasRef.current!, true);
    camera.inputs.attached.mousewheel.detachControl();
    
 
    camera.inertia = 0.9; 
    camera.angularSensibilityX = 1300; // Increase sensitivity for slower rotation
    camera.angularSensibilityY = 1300; // Increase sensitivity for slower rotation
    camera.wheelDeltaPercentage = -1; // Control zoom sensitivity
    camera.panningSensibility = 1000; // Decrease panning speed for slower movement
    camera.allowUpsideDown = false; // Prevent camera from flipping upside down
    camera.lowerRadiusLimit = 10; // Minimum zoom distance
    camera.upperRadiusLimit = 200; // Maximum zoom distance
     
    const ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 1, 0), scene);
    ambientLight.intensity = 0.5;

    const light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(0, -1, 0), scene);
    light.position = new BABYLON.Vector3(0, 10, 0);
    light.intensity = 1;


const wallWidth = 360;  // Set the desired width
const wallHeight = 150;  // Set the desired height

const wall = BABYLON.MeshBuilder.CreatePlane("wall", { size: wallWidth, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
wall.metadata = { type: "wall" };
const wallMaterial = new BABYLON.StandardMaterial("wallMaterial", scene);
wallMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
wall.material = wallMaterial;
wall.position.x = 300;
wall.position.z = 495;
wall.position.y = -230;
wall.scaling.y = wallHeight / wallWidth;



    const placeholderSkybox = BABYLON.MeshBuilder.CreateBox("placeholderSkyBox",  { size: 1000.0 }, scene);
    const placeholderSkyboxMaterial = new BABYLON.StandardMaterial("placeholderSkyBox", scene);
    placeholderSkyboxMaterial.backFaceCulling = false;
    placeholderSkyboxMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    placeholderSkyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    placeholderSkybox.material = placeholderSkyboxMaterial;

    scene.registerBeforeRender(() => {
      const cameraPosition = camera.position;
      setCameraPosition({ x: cameraPosition.x, z: cameraPosition.z });
    });

    addFootprints(scene, currentPoint);
  
    return scene;
  };

  const loadPanoramaImages = async (point: number) => {
    setNavigationLoading(true);
    const folderPath = `images/point${point}/`;

    // const textureUrls:string[] = [
    //   `${folderPath}_px.jpg`,
    //   `${folderPath}_nx.jpg`,
    //   `${folderPath}_py.jpg`,
    //   `${folderPath}_ny.jpg`,
    //   `${folderPath}_pz.jpg`,
    //   `${folderPath}_nz.jpg`,
    // ];

    // await Promise.all(
    //   textureUrls.map(url => {
    //     return new Promise<void>((resolve, reject) => {
    //       const img = new window.Image(); // Fix for Image
    //       img.src = url;
    //       img.onload = () => resolve();
    //       img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    //     });
    //   })
    // );

    const cubeTexture = new BABYLON.CubeTexture(folderPath, sceneRef.current!, ["_px.jpg", "_nx.jpg", "_py.jpg", "_ny.jpg", "_pz.jpg", "_nz.jpg"]);

    await new Promise<void>((resolve) => {
      cubeTexture.onLoadObservable.add(() => {
        resolve();
      });
    });

    const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, sceneRef.current!);
    const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", sceneRef.current!);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = await cubeTexture;
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;

    setNavigationLoading(false);
    return skybox;
  };

  useEffect(() => {
    engineRef.current = new BABYLON.Engine(canvasRef.current!, true);
    sceneRef.current = createScene();

    loadPanoramaImages(currentPoint).then(() => {
      setInitialLoading(false);
    }).catch((error) => {
      console.log(error);
    });

    engineRef.current.runRenderLoop(() => {
      sceneRef.current!.render();
    });

    window.addEventListener("resize", () => {
      engineRef.current!.resize();
    });

    return () => {
      window.removeEventListener("resize", () => engineRef.current!.resize());
      engineRef.current!.dispose();
    };
  }, [currentPoint]);

  useEffect(() => {
    if (sceneRef.current && !initialLoading) {
      sceneRef.current.meshes.forEach((mesh) => {
        if (mesh.name === "skyBox" || mesh.name === "footprint") {
          mesh.dispose();
        }
      });

      loadPanoramaImages(currentPoint);
      addFootprints(sceneRef.current, currentPoint);
    }
  }, [currentPoint]);

  return (
    <div>
      
      <canvas ref={canvasRef} style={{ width: "100%", height: "100vh" }} />
      {initialLoading && (
        <div className="w-screen h-screen fixed top-0 left-0">
          <Image
            width={500}
            height={500}
            className={"w-screen object-cover h-screen"}
            src="/images/UI/splashscreen.jpg"
            alt="splashscreen"
          />
        </div>
      )}
      {navigationLoading && (
        <div
        className="fixed top-0 flex items-center justify-center left-0 w-screen bg-no-repeat bg-cover h-screen"
        style={{ backgroundImage: `url(/images/UI/splashscreen.jpg)` }}
      >
        <Image
          width={50}
          height={50}
          className="animate-spin"
          src="/images/UI/loading.png"
          alt="LOADING"
        />
      </div>
      )}
      {!initialLoading && !navigationLoading && (
        <MiniMap
        setPoint={(data)=>setCurrentPoint(data)}
        url={'/images/UI/minimap.png'}
        cursor="/images/UI/user.png"
        offsetX={0}
        offsetY={0}
        scale={1}
        point={currentPoint}
        currentPosition={cameraPosition}
      />
      )}
        <Cursor scene={sceneRef.current} camera={sceneRef.current?.activeCamera as BABYLON.ArcRotateCamera} />
    </div>
  );
};

export default BabylonScene;


