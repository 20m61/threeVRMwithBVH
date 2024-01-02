import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { BVHLoader } from 'three/examples/jsm/loaders/BVHLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { VRM, VRMLoaderPlugin, VRMHumanBoneName } from '@pixiv/three-vrm';

const aspect = window.innerWidth / window.innerHeight;
const width = window.innerHeight;
const height = window.innerHeight;
const model = './test.vrm';

// シーンの生成
const scene = new THREE.Scene();

// VRMの読み込み
let mixer: any;
const loader = new GLTFLoader();

// カメラの生成
const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 200);
camera.position.set(0, 1.3, -1.5);
camera.rotation.set(0, Math.PI, 0);

// レンダラーの生成
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
});
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

// ライトの生成
const light = new THREE.DirectionalLight(0xffffff);
light.position.set(-1, 1, -1).normalize();
scene.add(light);

// Install GLTFLoader plugin
loader.register((parser) => {
  return new VRMLoaderPlugin(parser);
});
loader.load(
  // URL of the VRM you want to load
  model,

  // called when the resource is loaded
  (gltf) => {
    // retrieve a VRM instance from gltf
    const vrm = gltf.userData.vrm;

    // add the loaded vrm to the scene
    scene.add(vrm.scene);
    setupAnimation(vrm);

    // deal with vrm features
    console.log(vrm);
  },

  // called while loading is progressing
  (progress) =>
    console.log(
      'Loading model...',
      100.0 * (progress.loaded / progress.total),
      '%'
    ),

  // called when loading has errors
  (error) => console.error(error)
);

// アニメーションの設定
const setupAnimation = (vrm: any) => {
  // ボーンリストの生成
  const bones = [VRMHumanBoneName.Head].map((boneName) => {
    return vrm.humanoid.getBoneNode(boneName);
  });

  // AnimationClipの生成
  const clip = THREE.AnimationClip.parseAnimation(
    {
      hierarchy: [
        {
          keys: [
            {
              rot: new THREE.Quaternion()
                .setFromEuler(new THREE.Euler(0, 0, 0))
                .toArray(),
              time: 0,
            },
            {
              rot: new THREE.Quaternion()
                .setFromEuler(new THREE.Euler((-40 * Math.PI) / 180, 0, 0))
                .toArray(),
              time: 1000,
            },
            {
              rot: new THREE.Quaternion()
                .setFromEuler(new THREE.Euler(0, 0, 0))
                .toArray(),
              time: 2000,
            },
          ],
        },
      ],
    },
    bones
  );

  // トラック名の変更
  clip.tracks.some((track) => {
    track.name = track.name.replace(
      /^\.bones\[([^\]]+)\].(position|quaternion|scale)$/,
      '$1.$2'
    );
  });

  // AnimationMixerの生成
  mixer = new THREE.AnimationMixer(vrm.scene);

  // AnimationActionの生成とアニメーションの再生
  let action = mixer.clipAction(clip);
  action.play();
};

// 最終更新時間
let lastTime = new Date().getTime();

// フレーム毎に呼ばれる
const update = () => {
  requestAnimationFrame(update);

  // 時間計測
  let time = new Date().getTime();
  let delta = time - lastTime;

  // AnimationMixerの定期処理
  if (mixer) {
    mixer.update(delta);
  }

  // 最終更新時間
  lastTime = time;

  // レンダリング
  renderer.render(scene, camera);
};
update();
