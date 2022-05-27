import * as THREE from "three";

// ----- 주제: 기본 장면 구성

export default function example() {
  // Renderer
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    // antialias : true; 픽셀의 계단현상을 줄여줌, 하지만 연산이 많이 이루어져야하기 때문에 부담이 갈 수도 있음
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight); // 렌더러 크기를 브라우저 전체 창 크기로 만들기
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1); // window.devicePixelRatio : 픽셀의 집적도, 높을수록 고해상 디스플레이 지원
  console.log(window.devicePixelRatio);
  renderer.shadowMap.enabled = true; // renderer.shadowMap.enabled, 메쉬의 그림자가 생기도록 함

  // Scene
  const scene = new THREE.Scene();
  // 배경색 설정
  scene.background = new THREE.Color("white");

  // Camera(카메라)
  // OrthographicCamera 검색해보기
  const camera = new THREE.PerspectiveCamera(
    55, // 시야각(fov, field of view), 시야각이 높을수록 당연히 멀어짐
    window.innerWidth / window.innerHeight, // 장면 비율
    0.1, // near(가까이 보이는 한계)
    1000 // far(멀리 보이는 한계)
  );
  camera.position.set(0, 1, 5); // 카메라 위치
  scene.add(camera);

  // Light(조명)
  // 은은한 조명
  // AmbientLight : 전체 톤만을 조절하는 은은한 조명, 단 그림자를 생성하지 않는 조명
  const ambientLight = new THREE.AmbientLight("white", 0.5); // 색상, 강도
  scene.add(ambientLight);
  // 스팟 조명
  // SpotLight : 오브젝트(메쉬)를 향해 집중적으로 비추는 원뿔형태의 조명
  const spotLight = new THREE.SpotLight("white", 0.7); // 색상, 강도
  spotLight.position.set(-2, 5, 3);
  // castShadow : 빛을 메쉬를 향해 쐈을 때 그림자가 생성되는 여부(true가 생성함)
  spotLight.castShadow = true; // 그림자를 만들 수 있도록
  // shadow.mapSize : 그림자 해상도, 기본값은 512, 높아지면 높은 성능이 필요함
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  scene.add(spotLight);

  // Mesh
  const floor = new THREE.Mesh(
    // PlaneGeometry: Geometry, 형태
    new THREE.PlaneGeometry(5, 5),
    // MeshStandardMaterial 재질
    new THREE.MeshStandardMaterial({
      color: "lightgray",
    })
  );
  // receiveShadow : 바닥에 그림자 여부
  floor.receiveShadow = true; // 표면에 그림자가 생길 수 있도록
  floor.rotation.x = -Math.PI * 0.5; // Math.PI는 180도

  const box = new THREE.Mesh(
    // BoxGeometry: (1,1,1) 단위는 본인이 결정해야함(???), 카메라의 이동으로 결정이 된다. 1cm/1m/1km 등등
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({
      color: "red",
    })
  );
  box.castShadow = true; // 그림자를 만들 수 있도록
  box.position.y = 0.5; // 오브젝트의 중심

  scene.add(floor, box);

  // 기기 성능 차이에 따른 애니메이션 속도 차이를 없애기 위해 three.js에서 제공하는 Clock 사용
  const clock = new THREE.Clock();

  // 빠르게 반복 실행 되는 그리기 함수(제귀호출)
  function draw() {
    const delta = clock.getDelta(); // draw 함수의 실행 시간 간격(초당 프레임)
    // console.log(delta)
    // const time = clock.getElapsedTime(); // 총 얼마의 경과 시간에 걸쳐 함수를 실행할 것인지 결정, 사용하고 싶으면 box.rotation.y += 0.01;를 주석해제할것

    box.rotation.y += delta * 0.2;
    // box.rotation.y = time;
    // box.rotation.y += 0.01; // Radian: 2PI가 360도
    // 기기 성능 차이에 따른 애니메이션 속도 차이를 없애기 위해 Clock의 delta 사용
    // 렌더링
    renderer.render(scene, camera);
    // draw 함수 반복 실행
    // 만약 VR/VX 등을 웹뿐만아니라 추가적으로 사용할 때는 반드시 setAnimationLoop를 사용해야함
    renderer.setAnimationLoop(draw);
    // window.requestAnimationFrame(draw);
  }

  // 캔버스 사이즈를 브라우저 창 사이즈에 맞추기
  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix(); // 카메라 관련 속성이 변하면 실행
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  // 이벤트
  // 브라우저 창 사이즈 변경 시, 캔버스 사이즈를 맞추기 위해 실행
  window.addEventListener("resize", setSize);

  draw();
}
