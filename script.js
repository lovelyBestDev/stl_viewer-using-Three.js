var texture;
var imageElement = document.createElement('img');
imageElement.onload = function (e) {
  texture = new THREE.Texture(this);
  texture.needsUpdate = true;
  init();
  animate();
};
//imageElement.src = "http://blog.2pha.com/sites/default/files/me2.png";
// Used dataurl variable because of CORS. If on production site and image served from same server, just use the image.src as above.
imageElement.src = getImageData();

var config = "./config(part).json";


let width = $('#webglDisplay').width();
let height = $('#webglDisplay').height();

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearColor("#000000", 0); 
renderer.setSize(width, height);
$('#stl_cont').append(renderer.domElement);

const camera = new THREE.OrthographicCamera(width / - 8, width / 8, height / 8, height / - 8, 1, 500);
camera.position.set(0, 0, 100);
camera.up.set(0, 1, 0);
camera.lookAt(new THREE.Vector3(0, 0, 0));


const ambient = new THREE.AmbientLight("#999");
scene.add(ambient); 

const pointlight_1 = new THREE.PointLight("#fff", 1, 3000);
pointlight_1.position.set(0, 0, 2000);
scene.add(pointlight_1);
const pointlight_2 = new THREE.PointLight("#fff", 1, 2000);
pointlight_2.position.set(-1000, 1000, 1000);
scene.add(pointlight_2);
const pointlight_3 = new THREE.PointLight("#fff", 1, 3000);
pointlight_3.position.set(0, 0, -2000);
scene.add(pointlight_3);
const pointlight_4 = new THREE.PointLight("#fff", 1, 2000);
pointlight_4.position.set(-2000, 0, 0);
scene.add(pointlight_4);
const pointlight_5 = new THREE.PointLight("#fff", 1, 2000);
pointlight_5.position.set(0, -2000, 0);
scene.add(pointlight_5);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

render();

function render() {
requestAnimationFrame(render);
controls.update();
renderer.render(scene, camera);
}

function modelLoader(scene, name, src, color) {
const loader = new THREE.STLLoader();
loader.load(src, function (geometry) {

  const material = new THREE.MeshLambertMaterial({ color: color });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.scale.set(0.6, 0.6, 0.6);
  mesh.isDraggable = true;
  scene.add(mesh);
});
}

$.getJSON(config, function (data) {
  let menuData = [];
  menuData = data.menuData;
  menuData.forEach(function (item, index) {
      modelLoader(scene, item.value, item.src, item.color);
  })
});



$('#stl_cont').mousedown(function(event) {
    event.preventDefault();
    var mouse3D = new THREE.Vector3( ( (event.clientX  - window.innerWidth/20 - 20) / width ) * 2 - 1,  -( (event.clientY - window.innerHeight/20) / height ) * 2 + 1,  0.5 );   
              
    var raycaster =  new THREE.Raycaster();                                        
    raycaster.setFromCamera( mouse3D, camera );

    const found = raycaster.intersectObjects(scene.children, true);

    if (found.length && found[0].object.isDraggable) {
        var draggableObject = found[0].object;
        console.log(draggableObject.name)
        $.getJSON(config, function (data) {
            let menuData = [];
            menuData = data.menuData;
            menuData.forEach(function (item, index) {
                if(item.title == draggableObject.name) {
                    console.log(item.title)
                    setId = index;
                    selectPreviewModel("");
                }
            })
        })
        // draggableObject.material.color.setHex( 0xff0000 );
    }
})


var rotation = false;
document.querySelector(".rotation_controller_board").addEventListener("click", event => {
    if(document.getElementById('rotation_controller').style.backgroundImage == '') {
        controls.autoRotate = true;
        controls.update();
        document.getElementById('rotation_controller').style.background = "url('asset/img/r-1-1.png')";
        document.getElementById('rotation_controller').style.backgroundSize = "100% 100%";
    }
    else {
        controls.autoRotate = false;
        controls.update();
        document.getElementById('rotation_controller').style.background = "";
    }
})



var clickflag = false;
var originX = -1;
var originMargin = -1;
$('#zoom_controller_scroll').mousedown(function(event) {
    clickflag = true;
    originX = event.clientX;
    originMargin = parseInt($('#zoom_controller_scroll').css("margin-left").split('px')[0]);
})

$('body').mousemove(function(event) {
    if(clickflag) {
        var temp = originMargin + event.clientX - originX;
        var maxtemp = parseInt($('.zoom_controller_bar').css("width").split('px')[0] - $('#zoom_controller_scroll').css( "width").split('px')[0]);
        if(temp < 0) {
            temp = 0
        } else if(temp > maxtemp){
            temp = maxtemp
        }
        $('#zoom_controller_scroll').css("margin-left", temp);

        var scaleValue = 1 + temp / 200;
        camera.zoom = scaleValue;
        camera.updateProjectionMatrix();
    }
})
$('body').mouseup(function() {
    clickflag = false;
})
$('#zoom_controller_scroll').mouseup(function() {
    clickflag = false;
})

































const colors = [
'#dddddd', '#f22613', '#e74c3c', '#f62459', '#663399', '#9a12b3', 
'#bf55ec', '#19b5fe', '#1e8bc3', '#1f3a93', '#89c4f4', '#03c9a9', 
'#26c281', '#16a085', '#2eec71', '#f2784b', '#f89406', '#f9bf3b',
'#000000', '#ffffff']

window.addEventListener("load", function() {
    initial();

    var x = Math.floor(window.innerWidth * 7.5 / 100 );
    var y = Math.floor(window.innerHeight / 5);
    document.getElementById('col-preview').style.transform = "translate(" + (x) + "px, " + (y) + "px)";

    for (var i=0; i<colors.length; i++) {
        var node = document.createElement('div');
        node.id= i;
        node.className = 'col-sample';
        var degree = i * 18 - 11;
        node.style.transform = "translate(" + Math.floor(window.innerWidth * 12.2 / 100) + "px, " + Math.floor(window.innerHeight / 8) + "px)" + " rotate(" + degree + "deg)";
        node.style.transformOrigin = "0px " + (Math.floor(window.innerHeight / 3.4) - Math.floor(window.innerHeight / 8)) + "px";
        node.style.backgroundColor = colors[i];

        node.onclick = function() { onclick_col_sample(this) };
        node.onmouseover = function() { mOver(this) };
        node.onmouseout = function() { mOut(this) };
        document.getElementById('col-panel').appendChild(node);
    }

    $.getJSON(config, function (data) {
        let menuData = [];
        menuData = data.menuData;
        document.getElementById('stl_models_panel').style.width = 92 * menuData.length + "px";
        menuData.forEach(function (item, index) {
            var modelpiece = document.createElement('div');
            modelpiece.id = "model-" + index;
            modelpiece.className = 'stl_modelItem';
            modelpiece.onclick = function() { SelectItemModel(this) };
            document.getElementById('stl_models_panel').appendChild(modelpiece);
            if(index == menuData.length - 1) {
                modelpieceDisplay();
            }
        });
    });  
});


function modelpieceDisplay() {
    let width = $('#model-0').width();
    let height = $('#model-0').height();
    $.getJSON(config, function (data) {
        let menuData = [];
        menuData = data.menuData;

        menuData.forEach(function (item, index) {
            // var position = [
            //     [-2, 5, 0],
            //     [-58, 30, 0],
            //     [53, 30, 0]
            // ];
            var scale = [
                [0.5, 0.5, 0.5],
                [0.6, 0.6, 0.6],
                [1.5, 1.5, 1.5],
                [0.8, 0.8, 0.8],
                [0.8, 0.8, 0.8],
            ];

            const scene = new THREE.Scene();
            const renderer = new THREE.WebGLRenderer({ alpha: true });
            renderer.setClearColor("#000000", 0);
            renderer.setSize(width, height);
            $('#model-' + index).append(renderer.domElement);

            // const camera = new THREE.OrthographicCamera( width / - 8, width / 8, height / 8, height / - 8, 1, 500);
            // camera.position.set(0, 0, 100);
            // camera.up.set(0, 0, 0);
            // camera.lookAt(new THREE.Vector3(position[index][0], position[index][1], position[index][2]));
            const camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1500);
            camera.position.set(0, 0, 600);

            const ambient = new THREE.AmbientLight("#999");
            scene.add(ambient); 

            const pointlight_1 = new THREE.PointLight("#fff", 1, 3000);
            pointlight_1.position.set(0, 0, 2000);
            scene.add(pointlight_1);
            const pointlight_2 = new THREE.PointLight("#fff", 1, 2000);
            pointlight_2.position.set(-1000, 1000, 1000);
            scene.add(pointlight_2);
            const pointlight_3 = new THREE.PointLight("#fff", 1, 3000);
            pointlight_3.position.set(0, 0, -2000);
            scene.add(pointlight_3);
            const pointlight_4 = new THREE.PointLight("#fff", 1, 2000);
            pointlight_4.position.set(-2000, 0, 0);
            scene.add(pointlight_4);
            const pointlight_5 = new THREE.PointLight("#fff", 1, 2000);
            pointlight_5.position.set(0, -2000, 0);
            scene.add(pointlight_5);

            const controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.domElement = false;

            function modelLoader(scene, name, src, color) {
                const loader = new THREE.STLLoader();
                loader.load(src, function (geometry) {
                    geometry.center();

                    const material = new THREE.MeshLambertMaterial({ color: color });
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.name = name;
                    mesh.scale.set(scale[index][0], scale[index][1], scale[index][2]);
                    scene.add(mesh);
                });
            }

            render();

            function render() {
                requestAnimationFrame(render);
                renderer.render(scene, camera);
            }
            modelLoader(scene, item.value, item.src, item.color);
        });
    });
}

function SelectItemModel(obj) { 
    setId = obj.id.split('-')[1]; 
    selectPreviewModel("")
}

function mOver(obj) {
    document.getElementById(obj.id).style.cursor = "pointer"
    document.getElementById(obj.id).style.transform = obj.style.transform + " scale(1.08)"
}
function mOut(obj) { document.getElementById(obj.id).style.transform = obj.style.transform.split(" scale")[0]; }

var stl_piece = [];

function onclick_col_sample(index) {
    var deldeg = document.getElementById(index.id).style.transform.split("rotate(")[1].split("deg")[0];

    for (var i = 0; i < colors.length; i++) {
        var newdeg = document.getElementById(i).style.transform.split("rotate(")[1].split("deg")[0] - deldeg;
        if (newdeg > 360) newdeg -= 360;
        if (newdeg < -360) newdeg += 360;
        var result = document.getElementById(i).style.transform.split("rotate(")[0];
        result += "rotate(";
        result += newdeg - 10;
        result += "deg)";
        document.getElementById(i).style.transform = result;
    }

    if(setId != -1) {
        selectModelColor = index.style.backgroundColor.split("rgb")[1].split("(")[1].split(")")[0].split(", ");
        
        $.getJSON(config, function (data) {
            menuData = data.menuData;
            modelLoader(scene, menuData[setId].value, menuData[setId].src, arrTostr(selectModelColor));
        });

        selectPreviewModel(arrTostr(selectModelColor));
    }
}

function initial() {
    setId = 0;
    selectModelColor = "";
    selectPreviewModel("");
}

function selectPreviewModel(color) {
    if(setId != -1) {
        $.getJSON(config, function (data) {
            let menuData = [];
            menuData = data.menuData;

            let width_preview = $('#col-preview').width();
            let height_preview = $('#col-preview').height();

            // var scale = [
            //     [1, 1, 1],
            //     [3, 3, 3],
            //     [3, 3, 3]
            // ];
            var scale = [
                [1, 1, 1],
                [1.5, 1.5, 1.5],
                [3, 3, 3],
                [1.6, 1.6, 1.6],
                [1.6, 1.6, 1.6],
            ];
            $('#col-preview').empty();

            const scene_preview = new THREE.Scene();
            const renderer_preview = new THREE.WebGLRenderer({ alpha: true });
            renderer_preview.setClearColor("#000000", 0);
            renderer_preview.setSize(width_preview, height_preview);
            $('#col-preview').append(renderer_preview.domElement);

            //const camera_preview = new THREE.OrthographicCamera( width_preview / - 8, width_preview / 8, height_preview / 8, height_preview / - 8, 1, 500);
            const camera_preview = new THREE.OrthographicCamera( width_preview / - 2, width_preview / 2, height_preview / 2, height_preview / - 2, 1, 500);
            camera_preview.position.set(0, 0, 150);
            // camera_preview.up.set(0, 1, 0);


            const ambient_preview = new THREE.AmbientLight("#999");
            scene_preview.add(ambient_preview); 

            const pointlight_1_preview = new THREE.PointLight("#eee", 1, 1000);
            pointlight_1_preview.position.set(0, 0, 2000);
            scene_preview.add(pointlight_1_preview);
            const pointlight_2_preview = new THREE.PointLight("#eee", 1, 3000);
            pointlight_2_preview.position.set(-1000, 1000, 1000);
            scene_preview.add(pointlight_2_preview);
            const pointlight_3_preview = new THREE.PointLight("#eee", 1, 3000);
            pointlight_3_preview.position.set(0, 0, -2000);
            scene_preview.add(pointlight_3_preview);
            const pointlight_4_preview = new THREE.PointLight("#eee", 1, 3000);
            pointlight_4_preview.position.set(-2000, 0, 0);
            scene_preview.add(pointlight_4_preview);
            const pointlight_5_preview = new THREE.PointLight("#eee", 1, 3000);
            pointlight_5_preview.position.set(0, -2000, 0);
            scene_preview.add(pointlight_5_preview);

            const controls_preview = new THREE.OrbitControls(camera_preview, renderer_preview.domElement);
            controls_preview.domElement = false;
            controls_preview.update();

            function modelLoader(scene, name, src, color) {
                const loader = new THREE.STLLoader();
                loader.load(src, function (geometry) {
                    // var middle = new THREE.Vector3();
                    // geometry.computeBoundingBox();

                    // middle.x = 0.5 * (geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2;
                    // middle.y = 0.5 * (geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2;
                    // middle.z = 0.5 * (geometry.boundingBox.max.z + geometry.boundingBox.min.z) / 2;
                    // console.log(middle) 
                    // camera_preview.position.set(middle.x, middle.y, middle.z)
                    // console.log(geometry.center())
                    
                    geometry.center();

                    const material = new THREE.MeshLambertMaterial({ color: color });
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.name = name;
                    mesh.scale.set(scale[setId][0], scale[setId][1], scale[setId][2]);

                    let bbox = new THREE.Box3().setFromObject(mesh);
                    console.log(bbox)

                    scene.add(mesh);
                });
            }

            render();

            function render() {
                requestAnimationFrame(render);
                renderer_preview.render(scene_preview, camera_preview);
            }
            
            if(color == "") {
                modelLoader(scene_preview, menuData[setId].value, menuData[setId].src, menuData[setId].color);
            } else {
                modelLoader(scene_preview, menuData[setId].value, menuData[setId].src, color);
            }
        });

        if(color != "") {
            $.getJSON(config, function (data) {
                let menuData = [];
                menuData = data.menuData;

                // var position = [
                //     [0, 0, 0],
                //     [0, 0, 0],
                //     [40, 25, 0]
                // ];
                var scale = [
                    [0.5, 0.5, 0.5],
                    [0.6, 0.6, 0.6],
                    [1.5, 1.5, 1.5],
                    [0.8, 0.8, 0.8],
                    [0.8, 0.8, 0.8],
                ];
                $('#model-' + setId).empty();
                let width = $('#model-0').width();
                let height = $('#model-0').height();

                const scene = new THREE.Scene();
                const renderer = new THREE.WebGLRenderer({ alpha: true });
                renderer.setClearColor("#000000", 0);
                renderer.setSize(width, height);
                $('#model-' + setId).append(renderer.domElement);

                // const camera = new THREE.OrthographicCamera( width / - 8, width / 8, height / 8, height / - 8, 1, 500);
                // camera.position.set(0, 0, 100);
                // camera.up.set(0, 0, 0);
                // camera.lookAt(new THREE.Vector3(position[setId][0], position[setId][1], position[setId][2]));
                const camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1500);
                camera.position.set(0, 0, 600);

                const ambient = new THREE.AmbientLight("#999");
                scene.add(ambient); 

                const pointlight_1 = new THREE.PointLight("#fff", 1, 3000);
                pointlight_1.position.set(0, 0, 2000);
                scene.add(pointlight_1);
                const pointlight_2 = new THREE.PointLight("#fff", 1, 2000);
                pointlight_2.position.set(-1000, 1000, 1000);
                scene.add(pointlight_2);
                const pointlight_3 = new THREE.PointLight("#fff", 1, 3000);
                pointlight_3.position.set(0, 0, -2000);
                scene.add(pointlight_3);
                const pointlight_4 = new THREE.PointLight("#fff", 1, 2000);
                pointlight_4.position.set(-2000, 0, 0);
                scene.add(pointlight_4);
                const pointlight_5 = new THREE.PointLight("#fff", 1, 2000);
                pointlight_5.position.set(0, -2000, 0);
                scene.add(pointlight_5);

                const controls = new THREE.OrbitControls(camera, renderer.domElement);
                controls.domElement = false;

                function modelLoader(scene, name, src, color) {
                    const loader = new THREE.STLLoader();
                    loader.load(src, function (geometry) {
                        // const material = new THREE.MeshLambertMaterial({ color: color });
                        // const mesh = new THREE.Mesh(geometry, material);
                        // mesh.name = name;
                        // mesh.scale.set(scale[setId][0], scale[setId][1], scale[setId][2]);
                        // scene.add(mesh);
                        geometry.center();

                        const material = new THREE.MeshLambertMaterial({ color: color });
                        const mesh = new THREE.Mesh(geometry, material);
                        mesh.name = name;
                        mesh.scale.set(scale[setId][0], scale[setId][1], scale[setId][2]);

                        let bbox = new THREE.Box3().setFromObject(mesh);
                        console.log(bbox)

                        scene.add(mesh);
                    });
                }

                render();

                function render() {
                    requestAnimationFrame(render);
                    renderer.render(scene, camera);
                }
                modelLoader(scene, menuData[setId].value, menuData[setId].src, color);
            });
        }
    }
}


function arrTostr(colArr) {
    var result = "#";
    result += change(colArr[0]) + change(colArr[1]) + change(colArr[2]);
    return result;
}
function change(value) {
    var namo = value % 16;
    var shang = (value - namo) / 16;
    var result = "";
    result = result.concat(convert(shang), convert(namo));
    return result;
}
function convert(value) {
    switch(value) {
        case 10: return "a";
        case 11: return "b";
        case 12: return "c";
        case 13: return "d";
        case 14: return "e";
        case 15: return "f";

        case "a": return 10;
        case "b": return 11;
        case "c": return 12;
        case "d": return 13;
        case "e": return 14;
        case "f": return 15;

        default: return value;
    }
}

var setId;
var selectModelColor;

// function saveImage() {
//     let div = document.getElementById('stl_cont');

//     html2canvas(div).then(
//         function (canvas) {
//             let aTag = document. createElement("a");
//             const d = new Date();
//             let time = d.getTime();
//             aTag. download = "stl_"+time+".png";
//             aTag. href = canvas. toDataURL("image/png");
//             aTag. click();
//         })
// }

function saveImage() {
    //w.document.body.style.backgroundColor = "red";
    var img = new Image();
    // Without 'preserveDrawingBuffer' set to true, we must render now
    renderer.render(scene, camera);
    img.src = renderer.domElement.toDataURL();

    const d = new Date();
    let time = d.getTime();

    var link = document.createElement('a');

    link.setAttribute('href', img.src);
    link.setAttribute('target', '_blank');
    link.setAttribute('download', "stl_"+time+".png");

    link.click();
}




function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.01;
    renderer.render(scene, camera);
    stats.update();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
function getImageData() {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAIAAADTED8xAACoQklEQVR42uy9SZAl2XUldu59z4c/xZxTVeVQM4YCiEKzSVBqmqSmzHoh64VMQm960TsttdReGxrNtNJKpo2kNskoGdlNySBrQzfAJtggBYJAFYACsgo5VU6RkREZc/zZ3d+7V4vn7vFjyKzMrByr/rO0yP8zf/zw+H6Hc8+dSFUxPdPzZT08/QimZ6oA0zM9UwWYnumZKsD0TM9UAaZneqYKMD3TM1WA6ZmeqQJMz/RMFWB6pmeqANMzPV+wY6cfwRM5Kh4AxEEFKvAeUKioeKhCRVUJABRQqEIVQF2HQkREBCIFgUgV4SmIiQ1AIIYxAIENyICI2Ew/9qkCPCdxD4KrCmiQbD/aQzHye6s63JPhrvY24DLpb9NoR9xY8yGyHlyhbqQugyvU56QCkSD/ykw2honIJhQ1YCySWUSJiZramKco5fYCdU5Q3KTOopk5TXGTG3Ma1AZERAoQ0fTWPOqhaTHcYxzJ+nC5jHsY9+EyyQbS25BsIP17Ou5pNqDxnhQZxj3Ju/A5ihFcBhVIAfHqHakvXQFAwfCzARsYC7KAgY1hE0QpxzNkY6QdTWcpSrg5z60TFLfM7CmKGxQ10OhQ1KS4wUkbUx2YeoCnYe8JqiKkoirwTgabmg9kd1V76xh3fW9Ddu9KNqBsW4tcXabFUMWTz9SPSQWSB2NPBgCYoYQJUVUCoF4V8FABRGEMyIKtmlTJqIkpaipbTRo+nqO4qQuvUWOOWvPUOU2tBe4sEgC2xAbEIFLiqU+YeoDPD+4Fed9313VvTXZXfHfd9+7J1i0tRpR1JeupH8OPITmpJ5aKWQgPWCEACAHbY99CH2UfZELhFKTQEAyAQYAXgMNrVBjESjFMDJOadBZRE3GbF89zOmMWzvHsGWotmqXzFLfITG3c1AM8qtC7TMUhH0k+JJ/77ob01rW7JjsrMtjUwSZ6a+RyLYbwY2hOWgCeiTTY3PIPEasSgcDEpcGvvypw1Drrga9aaoICqiRQAQMCUlVRUAaxcCN1I9iEbKqSadrxeV+H29Ra1LzP7UWKUoqaiBKyCdlkenOnHuAB0N6pKnxR7K1itCf3rvn1qzrYcmuf6LiLvKvFkLQgcoGVgSEEhoYYBmBi4tK0B01ghNiUantPRx4ckv6JByoBfUEVCLgIgEJEoIBTDWySBwTqFQpVVorJNmEb1FgwJ9/h9iKfepfnX+P5V6LZM2ALNuCp4ZsqwKTs+ULykaxelv6mW7vobv9Gs64O1lF04cdEDvAgBQkZAhPbYOAZjCDoxIG1VBCVHiCoQYnxKSgKHgaTa/APAgGhuj2ipWJIeIGqKKTWDVFVcVAFvEAZAqhRROAI8Rwls9xctOe+Qa0le+Y9PvMuRQ2O0umt/1JbAi3GEKdZX0ZdP9j2Kx/LYEs2rqB7C8UQ2R7pCPCAkqVg44mJLFPwABxknRAeh/AWNQTaV4AD4AcPqQPBb5CGp1QpAAOqUIJogEPB8JNXNoCoOIIIBHCepBBPGDm4oeS9Ioq4taBejHpuzKC9REkLJqKoMfUAX8bjdpZ1uFNc/7nfuOrvXZXNq+rGrCOigg2pBRkDAlmACUxkiJiICVzKN0rDX5p24irMrfxAbfQJD60AehAQBbJUgSr5UD2t/i84h9IhqPrgHBRetURHnjzUQzUSsJoWL71tZk7Zs9+259/n9pJdvADiqQJ8WY7fvu27a37tcrH8C+1vyu4d5F3Ke6AxIMSgCGSIDGAIAFkCEZhgAqAngCrpL8PdOvCdMPaBv6l8QsnyPIycTbxSoRBozRFpJff1w1r6y3+SYP5rHVDAqwrUqxZQAZSgKWyqyQLPvkKNuejC7/HCObt4wSy9/mXThC8RBFKXQTxcLjt3/PatYuU3cvdjHW7peJeQEXuyAAORoSigGoYhIiKjCGEugQKqCVDHcG3rYSbMe60JDAQVweNZmZI+rYgjrdIHBCh8GV4AACtEIR4AMUEAIYgqgVSVFKrEAJQEKJz6vowHOurLqIu0g6hpizGBuTkHm8LYLw9f9KXxAOLzu5/I3qq/9UH+6d9Kb43yLlPGJMJKEcESWyYGMZEt7X1p48kEzEOGq2i2wjcBC+1bTSnhP1U8DpVghfZ5/qAOsg+HqoKgyTyuVm9dijhx9TLZdyMBDJWaUB4o1EvpIkRKjCSAqLrSFYgTCJALCYlAtaG2geZi8s4/Nqe/wqfeiV/5Gkw8VYCX3+qLl/6m9jdkb7X49Kc62PRb13XvpuY9Ikehriwu0TzHjEBZRlwR+UH+uQT6wQnUkloHuwBIKmBeS7Mhm4BTkAFFRJaIYSzAIHNQbSo0rwJ4eAeoSAE4qIeMIV5dNvH+QTF4nzLS+k2gQSVUoaoioRKvRE2FQFUFkgtUEUCRBzxEDUyD596gzhmefS168zvcWuSFc9xaIPtF1gT7xRV9UfVUjGT7llv9xK98Ulz998h6kBGzYwtERJENoS0MiKlCPkHiAWLiCvQHoGMCtqnCWioRCLGCaF/6CaAIHFE6R3YWFMG0yDTAFjYGRaCIOGjCvgKoOqiD5nA5vGc/gGSQsbo9+AzYgxYHkJQylDTgnxAQlJBJygtThYSvlT4QoCBRJlJReICVFJoXxnvNM13/jV+/RFEL4z2ePxe99QdkLBozIEvMUw/wEvH6Tntrxepld+uXxaXvY7ilWZd5TAYaMVsCE9lglAkRQAxmMiACGS45HyIYBQFqMIlNIEQhLPUUd8i2kZ7m+ARsS9MlRB2yHbUdmJSjWZgIJX6qNCd4D9UDmEe1Qk3YL5kOD3wBySXfIdeDH2uxQ+Mt+KGM11DsaL6tWTdwUqrhR0yWSXso4KmOlVVUvWhwEeLhAFEpoKLwKoVooeRVJIVJqHnCvvNH5vRX4rf+gDsn6YuYN/hiKYCqeie7KzLY9rd/Uaxfkc2r2LgEHRPlMEqGETMZJkOwYGsqk08lbU+AIXBZYwxSUAh2haBEMWwTUQvxLHEE06bGAmwH0RLZJjiGacMk4AQmBlmyKZTLsJWO4ToPhAHHvECrjJioH8Hn0AJ+BN+HFFoM4LsodnW0oX4MP0K+B58h31MUUFUYhGCgKqeAqKrCl8xp6QRUpfDwUK/qBU61EHhSNdAUC2/x7Gv2tW/Zs9+i9pJZOEcmwhfIG3xxIJCKh3eS9d3dT9zObffx97V7h8brgKMYiIlsBAYZojjAHipZGsslYW8ZIFiUUksV2mYDCJjINJGeosYptM7Ctik5jcYp2DZxByTH8/ykByPdCZh0kO+ZgDc1lxrUxsKADoSkQahZdQTfp8Gqum3k2xgsI9/TvoMfqnqogfqgSBTicCOkBIY6UVUwgQRKxAwBOZHcgBWG1RXkBeNcNz7yO5/KzrLkQ144j7TDaYei9AvTjvMF8QDqndu8IXt33ZUfuxt/o/11jPdgCoo8RRFZIkMcAUyIKIAcYq5wDogJhqAVJrEAlEjIpMQptd9CegqN02hcoHiWok5ZS0Nl4TFov2ThELNzvLg/7G91hBU98Iz2k2QigEAcJJPxFkbLyLYwvK2DG3A98WMoFAxXexWFQL3AQ4NnkPDVwwFepAC8aqFSOPVAHiGdRTITvf1H/Oo37Cvv2aXXYaIvQGBgvwCGX12u/U23egl7K379MgbryHaJMhhQxGyJLGAIJblZJnTBVZKKK4AejBoxmQRsKWoimoFtof0WkiUkS2ichGnBNkI+aUJI9Yi0PiuzEkqRQs2zZYgDGZAiasPEYEbRpWJX3Zh8pshChR2EQk5Dg3MgIoYK1DEsELIHJRPGKAQu13wPkvv1KzCRI8NRQukMmnMvuyt4iT1AuHLJBtrbyK78VfHhn+tgE/0VjkEGSA0ZoshwRDCMCEQMRmX+iZhgDlQpkw3SH3PnAuJFtL+G9luIZjk5ASjgESh3lcrk6xG7TE/A8H+2N9BjHhJDtQq1GWBQJNkmXB+9SxjdxvCW9G5CchWnbuLbFfASaihC/lh94EqBXNWJOpFCkHn10ByaLKB1KvoH3+XFC8mb/4iTFsrOzKkCPMMj3mvW08Hm+NJ/0N1lf+WvaLRGyJVzjhmGOCYYgmWypiI6DYXyBGPqLBMAskRsYCJqv41oDu23TesCTBNxG4hBDI5AqFC+HihNwwMLPJ+WAhyJlcsogvZLjpSgDCkAD83hxnB9P7iJYhf9a9q/Cp+rL0o6qCKc1Hkt42OPkpj18Aonmqt6SOYhBki0cZraZ8y7/3n6lf+EmvPUWmLzUroC+7Ia/2Ks/S2/c1vWfiu7y9hbhhnDgCJCxDBE8T7ggd2vYNsvZQuGkhhRAyYl26TWWcSLaL2J1qvgGMRQX055OAB4nh3AeUQN0YkLU6iCGWSABuwsdIFgUOxAcxS76gZwQ2AEkbLTINgCIRUlMioKI1AGCYhVFQxSj8Jp7rC3ovnIr33iTl4wRcZxG9R4Gdmhl8wDqKr6QvORW/kov/Jj9+nfYvMTQkEpODYwRDFTzFSJPhuCrULeScBDRJbJRGRbmPt9ar+O1nluvg420GEpPTIh9Puk0NM080/QM0Anai+qYj4QyEATGd5AtqV7F7H3IbJt8QW8aOizQQmKIKoicKKi4hVe4VVyVSdwIrlXB80YS1/jpTeT3/1n9pX3uDFLNn654NBLowCqquLVZW75I91ZyX7x5+itYHxPMSRDnDInAfMYYxkERKXcU3ha1e4TE7FF1EHnLWq/RfECz7wLE4OMUhzyXOWwhqPyxXSM+D/f+x3Kig4DRD2ei60iBNIcKhAnvWvIt6V3GcMVjFZVvKqU9dUhceZFReEFTiHqvSAoQKbw6sdCaMK2aeb16Jv/lBdfN+ffp6jBL48avDwQSDxcJoNt2bwum9excUXdHtGYE4IFDFcVbAQDMgRm4qp4Yb9zhWFjRC1KFtE6T53XEc8jOQkI1EGKz8I3eowCPIYFeXBP8JPzAodfoFVTGScgBsXQHMUcyRjw0JHmA/gC6gBFoIdCKlwZ1qsQhRokAryClCPRbKDjDOPcr70NcbR0zjQXlJhsNPUAT9L8S2/Db9/OP/lhcekH2l1l9BCBYuLEkCFOCNYgjFGzTEQU2RK3mHJsFEcWUZuab2DufTTOovMOyAEKLUqA85mfBL8IoOch9EEeQgOD4wgl4GowXsPgOrZ/jvGKZvekcKENoaqrgzqnonAS6knhvIrKWCXz6oBMBG0ks/F7/9Se/wf23Ptm5vRLwQ7ZF1zuAcAXMtorbn7g7l3yt36C0RpjSDFRDIqYQ7BrmUIxsynzXGWtMpQMgSMyMbXfRLyIzrtonkU0A3ioB4RU6CFlWu9vcR/pRj8RD6CfS0cq5+XLEu6ohdY5ABieptEy9T+Fz+BzDU0ICjKGWErARapQEnDiAYYRBSMfaeH98t9rMdQiw5vf4cYs4mYFvmiqAI+JfDQfFlu3ihs/ldWLevcXZIUsuBGTJViiGGAmw6GyjQzBmKolRcHMxiJqIZrF7HtITtHMV5UiEEhGZU3BMcaf7is3pE/ERj9FKknpIZWGAEjICDhwrMkpihY0OYFknnwPxR5leyKFigIEw1CiAH4YAEMURKQGhkFKWqAYYO1Xkg+KIqfZU2bhvLUJXuxM2QsKgcJVqXi3cc1v3sw/+r/1zocYb8GMKbVkycaMUGNvDQxgGHGYMGvADJAxBdjCNqnzLtpvoP0GGudhIiZoGEs4+SnQY9nzF8eo6eO87mj1BrHV0EYzuolsEzsfaf8aii58LmJVCSFKVkWuJSJyPhRN+FzEA8NCJVLu8PnvRG/8R/b179gTb4WOghfTCby4HkCKMeVDd++abF3XnVvIdknHiJjKzC4hQB0TJvCE7pVQvw9AwQZRG8kJNM+hcQbxAjgBGFrUg0cwPYc0QBUwYIt4ATBonofrgwyyzTCdQkMqEaosFFJvwsFWQUCkGjNlDkVPd2/7zVPaXDDtRSQdqrDQVAEezvZ753dX/Pq14uf/u/buYvsaNYgipjSiMsVrQosVRVzBnrL9nAyIGXGHOu9g9hs08201EVjJj1ENKT8k/JO28BHs1CP5TnpkaXxqn/AD/isHQEoazyKao/QcGqcwuK5bP6WiT+J8ESr/QDFBAPYggqgyMZN6UYphnWQOGxddfwN3PwbILJyLX/2GsqEXLyx+sSBQWd5TZP7e5eLqXxdX/hobF6EZIuGEOWJOiSIDJoqpHKoflyWZZByByBhKTyKexdIfoPEakjPEDCjUl2JIn1Gu84WfJ3vMDdejfiB8VlbFw/UwuIbtDzDe0PE99U5V1Nuyyyz3GtouC4VACye5SqaaeS0IanHiPV56J/m9f25OvMVp+0XTgRfPAxSZDLfd+hXZukG9VfUjYoE1bJkswXBo5K0qmQlh7CYrUchwtdE4hXgRySlEs+AIcGF42iEucwqB7qMEk53HEuIopKfQeAUUwY+IBnBj5UDQEVmQQIXIqBJUmIxyJN4TedEip/662tTfu0SNWWKmpDWFQPdHPqq+v+FWPi5++i+1u0yjdTQMrOGUKSGyTBGXpQ2GQ+sWGQ6NrsQGUZtmv4r530NyglsnVBQ+B9wBUVd/36KGR4ZD9EJK8CNgniMxwMGnkhMMyFL7vJg28l2yifZv0WiFSKAEYiUDBTlREERJQaTKqmqUoKzo3dbhZj7YAQiv/Q6d/soLRYy+EBCoHOjhC9m+XVz/SXHlR3r770Bjsp4SZkuUcCj1gWUO/VwwocSNyIEIJubOu0hOYf7blJyASUAEVHVsh8ayTT6lJyPHz/5uPqH7NjmG7mAtXfmlriBSiNdsDf3r6F+V3mX4DOJVLVTVKdSrqGQK0bJYqBDJVTNRzygiOvsPzZlvJO//1zz3KsXNFwQLvTAeQJzmI7+34jdv6PYNFAOKBcHkGyIb5rRNTiPk0oyQghlRC8lppKeRnoRJwAxfVINkJ28q4dA4Hv2yAqIHJPUO9/oQVMGhFfgk3BBFn8YrAEH7WmqIAgoWMgA03DIok6g6IRW4oe7c9rbpd5bRmGMTvSDTVp6zAtTIR/bW/O5K/rP/Uzc+wc4NpKDEUswmBZgoMghsTxSqmdlEDAhQwMSI53jud7HwHdg2bAxfQAQk++KuB2GLHBJ6PdiSe39YQfeFP8/Zj+pDX/b9YH/9Sj22uy2s/SOyEdqvIzlFbDBele5H7AqAEUVSAMpIPBzUhUYzMcYDVp2IAr3bmnUz7+Lf++dm6U1auhB22DxfP2Cfv/R7J+Nesfwr2brh1z/BeIMjQWI4IooJAetbolDZz6FFnQAPBjii1nkkJ9F5B7YJrlpAanN/zL2kZ8k5vtjRwUO/uq45DftubAOdtxHNkuvq4BbEQRyMAYNEwAwWtaWX5liUGV5VRHxfNy8XN38mgx1OO5R2KG5otSjty+gBRESKsfY2/PIvZeMq7d6E9UjBkUFMFBMsw9QdvQxmCqWd8OAIUYOabyI9g+brJeiXYqJL6zhxv5+t1keMcvXlV4CHLUaaaAPSImwuQ/Mc7Azlu1psoRhARsQMkMKEJTZlRYYyRQoCeaMilOfYu63Lv/TDXX/6q0wMm/BzbaN5PkFwyfeLaN7328vZL/4ff/nfaH+Vo5wS5sSaJsAGhinhaiR/Sf8TJEzvoeYFar+Nhd+HbYEskJXTph6IVR5NzOnlFPpHuGx9BOU5EDYkgMKPsP33GK/K3q/gwyRrDhBI4dSpimgmEIXzMlbJRUZOioiiGfO1/9K+9R/Hb/w+xW3i54aFno8HKLVOvFu76jeu6sqHlO+wcRobjpniwHKGFG8YUMWB9yQSMIEsNV8pK3xMCgCSVWVqk/TFsbKtT8B2fnEwz0M4vmPDZc1BDBOjfQG2RW5XR2vwYxJVQwRWzzBKYbuCF1VDkWewemO8Vxno3V/5RrtozEavfROUPC8UZJ+P6Afwk4+Kuxd1/be492vwCEY5SigO/excji601ewdQ+WmOTawKTVfR+tNNM+HN4O641nOY2/k45W+fRnigwd1+h/Z2wECR2iehe1QsaOuDxQkAoIakDAZBZHaMJpdSBkk5Iy6HMWINj+WRsc35u2Jt4gtjH0uwYB99tKvqiKio67c+YX/5Z9rf5Uw4pQoZpMAMZExocKHTNi/BYqISIkAo9w8i2QJc99CNAMoND9A4+x/etV0t88mOqdb0o7QYoc+tHpi6aHYSgQUw7Yx9z5rjvGa9D8lLySQiMJ+GjLlvjSE/WmpFzJSiA5GuvarYnfNzJ3hhXPm9NfqYOBZ6sBzgkD5UAZbfv2ajjbJ9cgqRQaGYQEmsmFYFVfrt0Ivq4AZJkW8gHgJtgW2Vf+uHpeIkmPGVREdJ/A6lfqJhwcnX+hnmDSQgADTRLwAcbArQAZ1BAZDGVAmVqjAQDX0rDIpqS3ghxhvycanAPH8eaTPYdP9M1KA2vaH3nbZW/X3Lhcf/QWN1ohyahiKOXR1IQron8sFLVG1kY4AE3P6KjpfRXISJoV6SD5hoo7cTn35w9nnGDrjfs7zIBbyHmBwgtbbiE9wvq3jeyrboaMYVA5wp+BWSEiZFGAlbzHOkG0Wv/ken3yXF1+npdcns2PPxg88cwjkCxl13eW/ko0r6N6AdYHqQWzIVp2Ndl8HwmdIKGBaSE5g7htIT8A2IVVZ/6F4V/V4udeHtmpf5nCA7mMg5Fjd0P3/lgw2Ac9j9uvEMSRD0UdoTrIGIlWDPakAIDJCXssNZ/3bnori0g/x/n9lmvOI0i8yBFKXyXjP79zS7jLcgFItxZ2r2fz1wrkwuJyqmNU0EM0gXoJJQaacXHDMrfvCUTovKH10yK4oyIATxAuI5mCacAMKVRRhHlGlQsRM5EGAZfJCTrQYYrQr2zd1tKtR8oy3EDwLBQhRb2B+/MZ1d/Nn/vK/02zHNEBJxBFxwhQxmfIrDJFlYiYOG6YZpkWz76J5Fo1XAA8NozsOlrIdm/+fCv1T1416g7eAGOkZQMiQbn8Il5EIs2q5TJyIVcmzqjIZeIEhEMjBbblL/5bmL8ipd6Ov/JGqEhEzPwNXYJ+26O9/9YXfvu1u/sT99ofkdtkWFLNJGJYo4lLijSm3FTERh9GFBJOi+SpaF5CcgIZhl7q/UuUBDexTqvNZOATdR0QKkEU0g9YbNN7UbB3ZTgClpNUAJTWwYUOHsoYJQwwo+76/+kPdW+alC2buVUSNEDA+7QTZswqCRaTItb+uu3fRvQMtYITYkkU5tZx5YnwVVZt3w6yrGPEcTAeclhXOOhmdyVS6n3fcUG7wBgjkQRG4jWQOvo9iFxJWl5XBHFjBBK0W81gQExl4CHqrmnSku4bGAnP8bEoknroHqEr9xzLcyS7+QFc+pMEqtYgiS4mBZdjgBML8Wi5HPHC5542iDuIltN+FnQEMfHEgUNMwokOfkDGbnkc/crBYwnuQgWmi9TapwPWQdQHVMBwlbCy2CiNa7bqkBGAhER2syaZmv/43ye8vUJSKCfMO8LJ6AJ04srPid+7o2q8xuEdGOWyqs1RP8Kz3kAbjT8QIhf7xSaRLiDqAQhzU71PFU7v/4pCnBzLEQbLaiBaQnIIbwTuq1icrK5QgRIbLFI5TVeZIxYgWPaz9xq9dJhCdepuNrSH0U1KDpw6BVFW8d5s3ZP2Kbl4mHSAGWVNa/XJfCwcdIOZydUWYa2ISJCcRLcE04D1QAFLuxw2HpzD/eccHdGg/TujCMzAJ4nm40xivQ0fwRUA+pBzGr4MBo1BC2E7rDGJPbiRbl+Xebx0xL14IgyRePgg0WfIgxVj7m3r9x7r2CUuPIuGUOQYsERtiQ8xkDVkGE5fNvgw4ippIFtB+DaYNlaq3HfugPyxtOW5g81QXnhrgeTC2nMgMaIyog/ZrlK+i2NPxBsGQQlVCE2W4VaReDRSisVfPmiuKsdz8W91d0Ve/Ku1TmnZq8/80lOHpQiAA6nK/t+a7axhuEimFsn4LGCDUudVsD1XtjlAQwySIOqAGKEx28BM9jY9SxDs9z8EzKOBADEoRtSEFiMv/YSpbBRikAJMaKpdzMpMRMpDRjtqG212zUYvSTuCCXjIPUBU9OOlvuis/wsYnNFjlBnHMiAy4avWKzESbS1AABQBuIj6B9ByoBRAk23e3h+u0jsz5mUr/M6VH9TiLoxAPRKAm0tdADWRbcGPAg4mUINCys4/gBSAwU0QAcQodrakb+ms/BhB1TiqRiDyltIB9etLvvZfdFVm9KJf+LWUbZAqKo3Kqc2yIQbZcV0QGMIH7D0N+DNJ5xEuwS6AcQNnleADoT2zpOjYam55npAN6zK0p/xaAYJYQG6SLGG/A56RQKLEQwopKJssQgoC9UyYIU+Hgu3L1LzlOZe6Mzp83NgpC9cSB0NP1AL63IXurGO8QXFjWW9p7KrNd4JL5OdjEaBA1YVKwrXJeYZ43HRhVUH6d5gGeFJXzGGhyIg8wWZBSpykVYAuOYVugHSCv6iZARMpaAqGyaIIhCqNkCFBku9Jbd7tr0dzZWvpfdA8wSX0C8Ksfy92PUOxQAxQZRISIKXD/YaBnRPUpa3HZkk2RnELcAROo2G90hN4fcU5t/2OL/WcakQd/vEdHyk2EzExQC5tSehr5DrRQl4WAFqRg0giAIVKoskBYVZQSg9zraFe2ruryh/bs+7DxS+AB9qG/iGR9t31Lbv5E7100RigyFDHFzJYokP3EqJB/mQZmQAETI+rALgAJpIAKAJipdD9RuTcMonKpFAA2R7YAhp7VULNAqgqnUIWXRzA0qvAEyqFAtAA7A8kgeeUZmILAm8DwMIwyVCMmJwLDufO7N+S6cW/8gS6cN+0TITf8ZGPip+IBAKgrtLuu/XXKdsggWP1A+BCD9udb1Qu8AISaiAgmBaUIy8vh942VHvHXU+zzyCafwOS8F0WRixMtN4ArvO5nsZjApJbBCgIZpoQ5JGxKUKqfxYTW9dKhF4AT2AQ+KRd6A2AFCEJl/W9lAYmhhklVDeAGOljX7ro2F7W1FELhFxcC1eZfVXW0Kzd+QsM1woiSkvckYuZyxm251oUpPAgOlEyCeAbJEkwE9dCizPtO0s9MX/wJzk/2BHPDYY0aQFi/trW1NfzVbzdv3+v1h0W37+5tjtY2R+MizP1Bq2E7TfvGa+1WM5ppR+fOtP/hN04vLjUXXl0ACB4oHATlMlmaMPmHdAOAOhADKeIFwJPrqsugQhxywkqGQaI+iAERixqFKiVssgL5jtz6e07bunA+1BQ/2fI4+6REf18BvJf+uuwsy+rH7AZsUHW6EFlCiIOJq8ZrOkDtM4MTmGY1z/nIYmqisgSIph7gIY4JrXQyHOT9QXb9bnevn9++N9pZHwyGfn1r1B975yR3NBhZcBpF9eAAznJe3VRj8yhyy2v5teVRsxEtnGicXEhPLaQXzsw0GlG7k4AJEtzHZCBwyEEo4MENcLPq7qspjXBHSQMW0DBFgogIOasRLjK/9ltZuMAn3tL2SaUnTAc9hRhAvN9Zke0bunEJNIBVGEthWGSo/TTVBru694UqcSYDSkCNKu+rxyPLKen52XFtwPAqqllWbG72V9e6f/PB8p17w7//zXZeWGKO4jhNY2NMFMUcJ7MJmPa/URXdsRTOOeeybDgebSpkpqFfeWPmvbfn8O1X5+ebZ+K5NDJEYKq68wjHTJku82IJqAGy1dQJ2r/vQR8MhYCcLAGk1lChohm2r8rWu37nDjUXVG1dJv1iQaAy9hXxReZv/Vw2LrHvUUMoYURgQ0yh4IcBpqhc50XWlL++MSCLeB7xHKImZHwMvgwVojwV/QfTkqHxnBCZaxdXl1e6//Nf/HZ9q+j2tNVuG2PnF8+kadNaTuI4iiJmjiLLoRyrDgKIVNU755z33jvnxlnunB+NR9fW8k9ubf+v37vdSOjrr7f+m3/2tTNnOmffWILz8AoReD2sAwHNmhhxB/ESqYcfqw+jDwzglEEgzZmgxEwkyiyRhxAJeNTXzSvu+t9h8U3DUQ2BXiAPsM//ZAMdbsjmNd25xcaH3FY54MQisP5hqxcxUI/BYAUYzOA2KCpnmh9tdAzh1JT3P9bwlwEuYNDdG25sjT68vHP16t7WTrbXtUzxzEzU6bSjyDYbadpIDXMUxUH0jTHGmEPxpaqW4u+9cz7Lc+99ljWz8Xic5dZagqxu67/+4fLiQvLuO1vvv7OwMJu020lFHx1aIR5CbIZpIPCALAhYhhleibwaAiuEYAEicqE4QmG8jjd14yoG6zCsZv4J5gTsE5F+hEFXIpr30d/A1qc8WGVWtqYEP2Gyuan22O0XrNWBgAHF4MbBfl99FEL6Sx7pAiABCo97693fXt35v753/faaz3I6tbQwM5s2m41GoxFFNk1Ta60xJoqi4AGIKOjAAQ5fpCiK4Nidc3mee++9lyzL8jyb6bTGWb690/t/f7zWSvG1q+tNevPNczM2XQhjvEFy8GZpSehxExSDclBel7FQ3fzkGSaQrUqWYJUNC3sMNtVf1d49sQmls+GanwgQejIKINVxOyv+9i+kf4+KPRszYiAmZlNW/oCr5i+UbQDltHMFG7BF1AAzUEzUPhzHd0514ECkW7XUObe6OviLH1z/q5+tb+x6jmZeOdNOknh2ppMkSZIkaZoaY9I0jeOYmZk5KABXozlrHfDeB7vmnCvvrHMiMh6Pi6IoiiLP86IoZmdnlhY64yy7frf33/9Pn3Qa9N1/cu53v3nym19dQswQgfcTd1JBgqgJE0HNBK3BQYigDAgklAMrE8RCE085az7W4aa785HJxzR37gnSQU8UAnmPcU9790gyhlQLvOhAsWeoaKKjy+oM2IBsOfn5y7u44tENP8OruMzfvtW9udK/fKO/3dXcRXOdZqfdTtO41WoFBYjj2NrSAwTkU3sAPjietsa0hxSAmYP0W2udcwBUxJhoNPZ7u7nz7pNPe+1W3GlFr73SsWWRS507E5CWw6XJHK5bDLtOiLSciSbVWBBSQ8wCn6O/Lq1F9V6eXGGcfWLSLwKf+53buPuR8V02DrGliMiSWnA53b/UAoRRGfu/A8HGsA1wAgXEH9xkN9WB+0N/AyQ228u31ob/47+8eHM1u3THvXH+1OnZ9vzcbLPZjONSAeI4jqLIGNNoNMzEoYMn4IoDHR2V9NdYKJh/51yj0Wg0GkVRzM3NbO92+oPRv/rLlV9d6v7m463/9l+8M7vYjJsxRlVMLChHaNkUyOCHB30AMVQJyighlAUpQQgRs/dwA792EUr69UyZlfmJ8KH2c4r+Pv3vMrl3ibY+RfcOrFQNX/vZLlC12jpMfCjz30ENCNQENUEh6TWBf5RLOzHVgkOyT4SIPXTj9t7/9+H6f/j5+q+ve6HGe19dWFyYazWbM51Oq9WKoihN0yiK4jhOkiTAntoDHFKAo/fXe1+Se96Hp0H6i6Lw3qdpGhQgTQdxHI/HWRxF3b3ujz/q6f9x5R99+8QfvH+iMxczEQoBBSVgUApyoC7IE2tYYEsMDc3yGiqCQYbUg5gpUnjAgbp3NWrL6sd0+itkZp8IH/oEPEBI/UK89DdluMPFEJGU4L6c7RBgz6QQH5pdHjIA5j77eabnOL6TWeGLQtbW+tdu9j65PhjmabOZLM7PzLTbjUaj2Ww2m80a81hrgwJYa6MoCrAnKEDgfw5BoDoYKOkNVVUtiiK8AzN778O3WGvDq6y13hejUbHRHV+81n11KX3rtWazE1FUCYACKuW9rhOgNEHxVYxWhZOhFBgUgJWKEYqe9DeMvBkE7/NXRnxeD7BP/+djv/JL7N2GjDghjpktKAIskS1XmhpClQmuqq/Cutkw+8TEkAKkCCs4JxVg2uZy2PwDKY92x7dudP+H/+Xy7Q3aGbXe//prM53W7OzczMxMmqbNZjNEvc1mMxj7WgG4OkGC+bj9FJOFLbUOBFcQgFCgiYbDoXOu2Wz2+408z9M0abdbJxY7P//oZne4+fGne//dv3jnxIlGYyFBJvABCFlQDGbAVaUTBDIwIFWjXgxCn4CqQMECjUiFfTaWwYbe/jmf/io1F+hJNMrYzyn95aeTD6R/D2uf0PCesULGlBmAstXLUNXuSKHiDROJjNAWycEq1NOe5b5jbqcnZpBKb/zLj7b+8u82rq1SZ3buGxcWT55caqTp3Nxcu91OkiQEAMHwG2OCEwhW31oLoMY/tQIcDYLvpwBRFAUFCNFwlmXW2jzPjTFxHFsbv/8etra2P7jS/df/fu2dC63/4h+fhmEQkAuYQRZkQr1jEAoVEBMEYRQWGCqGqjlCapiMGOvhe27tonTvSnuBGnP1dT62DnxeCFT6SpdT3sd4h2WMUOxJNbinctDnft6bDvetlzEBVeUPuu8Qp+co7UMiqt297M7a6OqdzGvUaDQX5trtVitwnWmahqg3juPa8NekZw39a/6nNqKHINAkwV2joPobg/WtcYiIGGOccyFUWJif2euNh/nw6vIwitDv5Y1OZEyYdkOQMPOeDzT0Ke2HN6z7FEiYlcakDFLP2S7lfRQjNOYm0dpzUID6o/G9db9+WYabhBHHUEthi3VJUVOFL0MiDJVKhGRwsARln7xWTmB6jqX8gdjAu163+N++d/Nnvx1fWtavv3N+YWF+YWFuZmYmSZKZmZlg++M4TtO0jnoncX8Q+vAgcD7HgulaDUI+OLDvwQMkSeK9DyGB9z78CO89Mwe6iYiMsfOzzb+9ePPa3Xymrf/kP3311IkGIqCwgIANlIHK7QcFIMAwQUngqSzrICIyJJYQA66Q0TY2rmoyQ+1T4SceSuE9awgEQEdd3bnLMiL2MMRMMKS23H0WkpT7hn+/AI7K/gCOSsUIjMDkzJnpOYT+jS7fHtxdG394abTbj5YW2vMLs7OznVar1el04jhuNpuNRsNaW/OewQ/U9Q6HPAAAvs+Outrqh++qW70D7Kn1J0hh0IRal/I89yKiurg0p8j++oPuG+dmGHriRFIJgAU5hEnRkyvMa+K76hsRW5YIeUPwyjLW7j3tbRwSwsdDQZ9LAfY1YdSTvXsRMjaemMmirMeyYbdX1fVS/YoVGqoHgJrKG/oDJPdUAQ6Zf4aqfnqrf+XG4OKn2dx8++xri3OzM51Op9VqtVqtOI4bjUagfWoIFEB/+Fo7gRADhJvxmUHwZDDAzHWuIHzXpALUOdqiKMI9fOX00s7u3k8ubn3nm712k5ZORmQYymCGUlm9RyDaH3dcWktmGFEAnuDD3iBmo6DC9Te1tzUpgc86BthPE3pPboj+Cu1egeSB7Key870COlX/V2iDDBm+AypPBqQgV3mAaeB7XM4rNlnuN6/v/bufbl+9nS0snjhzeumVM0tzc/OdTqfdbrfb7cD6NxqNQPyHqLeudwgKUFvumgDFAbN02MDVWHdSDYJDCK5AREL465wLrGgIssM1FIVrpmmvm//Vh73NvezNV6LmbNtEhMzA8z6pVfaaESkrA5AwQREIwwJZWWGUxBN56t7Q3UUUA6cNY6NwMc/aA1Sfk8i4h6xHxRAmDDjZN9/VXPiHMeeKKls41YHjFUC5yP36Vrax7bZ7mJlttpqNRprG1amxvp04k3C/fjxJ/txPASZ1YDJJLCLhld774ENq9aidgIiEvFtRFI1GmuduptPa6Q3ubhbbu3nUciahz4C4DBIol1dVhscG8ESGyI+p6Muoa9qx6ueSYfvY5j84O/W5X78qO7cp3yNGudooBLRMlSZwRQfRvj5goiEGDHVlLdT0HMv8WEiR7+xkf/OrveurtDNovPfeqYWFuXAC/gmGPwQAAQId8gBHRf/Bixknd9oeuOmqge1xzoWK0RoCBT9TQ6xQOxTHsYj76Yfdy7fGf3+x95914nS+FJGJdqhSMFQpdEqWRXJQMIEVJoAiqCHkXe2t+XuXOP422eTz1MY9vgJUFRCF7NyR4Sb5kWkRR8QGqJd8GYN68vOhqp7DbiHwP/7+C66/ADb80T7mib9JmVeXB1euj/7yg8HMzMkTJ9pz87Nzs7Ozs7PtdjsEvu12u6LhbR37BlqmLvY8hPgPqcH9bvSkYAUbHxxCeP8QGNQP6jxD+ClFUURRlGfZ6+dPD/u7/+pHm2+81myYuN0MYyYOBXw60S8WJmQSqYdAVY3xqpCEdZhJtoet2+bUV0M24LEjgc8VA6gqqepoj93IsNSsf1XmRofj2QNhPh1ecBSSgvRSNLw86ysU1d2e3+rKTo9On2m0Os00SeMkiaKopvxr4QsKUCd9Jyn/SWN/lP4//EsG+FFB/zIUNwcmNoentZ5Ya4NiRFEU0mRJkoj3SZLMtFKXJxub2O35/tC3Ggf7N5VAdVNlLShaZwaISKuyYsNKkvvRLrybJIKeNQRSVfG5bN+0w02WnCjC5LwTYqp5/2ro//4amAMfuoSdOYCAFUQvKBQ6cMfogYpR2bP9su5jd7JPVH0fXuRaPWcCILlcXs6v3HEbe/Hb73ZOnZyfmemEE8x/KHiu2c8aikwGAJOBbxDih2TQawg0mQsLyKeOCiYf1HoVImNjzGg8PnFiPi/8by7f+/SOb6XF0qy3BzaclyJBoSkMpCRhbpwSh0pphFwYEUuBvFdsXddiFETxUED/LDyA9x7FgLI92ruDrAsGbC36k9N+JrH+sRxnOZkG4HK79fMPfulBgXrQzroNfH+Luk4I/YEZCcdNTTuiAMdcAwGAZe91e8v9+kp/ZdOcf3VpYX5upjPTbrdbrVaoeKvj4EkINMn3T/qBGvPUsezGxsbOzs7GxsbKykqw32fPnp2ZmTlz5szs7GxwI+WoP+/r7wr6U6vBpAJMVtdlWUZE7XZ7ZmY4GudnX1n87e3RcDx87wKasTemHktHkxZ/Pyaop2JWMSQMwQCS8d4dGu9Q0XdoP3ZV3GN6gGAVqBgjH2rWh+Rl1Ms0cenVtlM6ZDTrkGAC/d9vBsSzPvoZ/6haDqsLBUsyqRnVHz0k9/fbTjypFXy8EhIBLKLjoVvfcnsDM9NupkkSR1Fge2rMUwv9Ic5nss6nNsw1thkMBuPxeHl5eW1tbWVl5datW4HcHAwG8/PzIenbarXa7fYhsFTzQtba4B/CD63RQUgMhwuLqpMkcaeTbnUHlosiNxKp4UnkcyT014kcGU24RAbUa97XfKD5SLjx2CjIPob0B56LCcXuquzcNjIiFrLGWJAlRAH5EJn6I8e++iL0w9c2TkEKLYCipIueuhrQwc/4gKcHtCpbD9uv/IRFD40Ksi+4OiHuokc0AceNLtWHvcLSZDCIc9G1XffJsnVqvv2NmdmZVrPZrM1/3ewSPEDI/k4GAPWZBDyhv/HP/uzPLl++/JOf/GRlZWV9fT3YdSKK47jdbr/xxht/+Id/+K1vfeu73/1ujfgfECKLSJIkdUgQJDLUouZ5PhwO86I4c3Luk0s7G5uy3Zc4lshOjNElBivUQym4hbI+zJAqEZNGhsgbD4mMgtiP3c4KJ7P2zBwmApVHCoUf0wOUJUDjrgx3jB9BXZXhQjXmjvapz0lkTMfNdavm81Xrj/RJCzwdNuel7PoyAglfwzQKlRKJlcZ+Uqb9cXJcqwEOCj0dVjn9LJClR3SAFF6LTLe7LJoaEyS+rHWb7PM6SvaHB7W1nix0W1tb29zc/PDDD7///e8vLy/funWr1+sNBoNavrMsy7IstIAtLy8T0e/8zu8sLCwsLCwcGzfXPzEkB2rzr6pxHNdpgUbaaLUaoEbh3VY3m2lpu3Eg6K6CHz0oLVUJHU1MuYPAj2W8J8MdoyIi/Mw8wP6TrIfxLrkRWVcVt5X07gT652PSYJMeLcicFgBBk2PSYZ+XRD8ELSuxFpQrh8ufqOUOsvqp6kGEIwff58E6R8d4GHoU51S/jUMxpq09Y0wjSprNRqj1TEKfVwAYdb3D5IyTY2EPAOfcjRs3rly58qd/+qcffPDBzs7OZMwaXlMURZZla2trq6urV69eHQ6HzPz222+HkKB+w5qAn6RGgvMJHcMA4jhW1aorP2k10zhKJc83d4cnZxWzVDrYY8p/K9GH7sNpqR6wJxkj28V4T6vsRB2EPAsIpCDp72p3EzJS8YA5vL2xIq0qLqhKC/Pkna4254gDA2SeHMipfoZ3B8Qa9boxKQf6kT6wCrUGoQbP+BAAjIduZxdX7trFuU6j2Wk2m6Hqoa58ntSBkPY6WuVfy0SWZTdv3vyTP/mT69evX758udFozM3NPaCnJMuywWDwve99b3V19e233/7jP/7jhYWFNE3rYLqulgsPQrVFAFEhYo7jOAChVqtVFEWj0VxcauWZu3R3Z2kOr5+q1gbvE6BMXNoa1WoUmmCCDwVCA4GMpbeNZCvQxDTB1T4tBZhIgHkUQ4x3kO0whA1CP3/ZATOZ5TpY9XMfKxiEElBfeYyHdwJ8QFhJ92cQlMs13AS2qZDMJG7RB5vo55eUICij8Bjl2OsjTeJWM6lLHmrwM4l/DqW6jnIj29vbP/zhD2/cuLG1tRWa5Y+OxDogH9aGPuC7d+9673/84x9/61vf+spXvjKZK5jsDagZ0uAoQnBcx8GBqmo2Emi8s0eDEbyQCVXw/uDayQMCU7VIMkFISqtKhuHyPR1ta95XY5XTx8iFPS4LJB5Zj0e7GO2FtDVMxVnsk1afJUOTRJA6iIBiwIJqlX9AWwzdB5BUcl/jGSlKcS91yh8XZtBxPMwLkXfIPY1y2htSlMRJul/wU59JCujBtT0isrm5+YMf/GB9fb0oigfb/nCSJAmU9+7u7mg0+tGPfjQzM/Puu+8e+q5JV1NP8Q9gIXiAyfKkRpqIS7a6GIxJiE05CUHve4srFmifUDEhyQST9WW0g7yHuKmaPDsWyOcj6d7VYRj/r6Gnpa7+BB1EOjTpCOi4u8yleaYREEGjKlUs99GBeqlJYJCkilAF8JCKplQ9+Mnqiyro9/dtBrnaYUFbXXvubNpupfV4n8kS/zqrdWjGyaQmiEiA/p9++mmr1SKiRqPxMJxJXWgA4OLFi++9997GxsbS0lLdTFMrQEgL1HmGgMecc/UgutCj02rGLo/WN013JB6wxwWIIdNSB1ISVksyIPuBsVqg2MNoQ7urYhuIW49Bhj5uJZ16zXrqxvB5mHNNk1Jeiz/dD0rQMVBbMUEE2Xpu9nFUie6LOLnqX3xZTaRH6cjjfujRiUMvXieaEonCeWRF4Hb4UDPXIbv74Gzu+vr65uam974mTB/+ShqNhoiMRqPd3d2NjY35+fljf+KhREFdcDGZlzDWsDWjMeWOhOrA9tCcrEPqQAfMaPW3+kLcGNlAXfbUE2GTyXB1me/eo2JAmpMltnWYe3Di1SH0f9jY8OHHvihTwiaGEogh5hgeM6hKCGSlqDj7mq3ngx/eEWUzOAaeqZbLS/yLhIAIzlNWUHdgo9gmyX5eabLSYRLHH611K5Gf9z/72c+uXbsWoueaJH3IE7rgnXO3b9/+4IMPzp8/H/SnpoAmw+K6ZLpWzknAliZRHMfdgR0XonQEjk6C52OixzIAgAFZJi3IjVzvnpl5hQ8WazxdGlRdQcNtKQYkmaKs06iroCfY/0MT4Opfhu+D4yumxReVHzSlZDMDCpGDTLxMRAt04B2CTpVXxSBCXOVWnZY7HQJYUqpoZgMmRFVO3iucQAUOJSXqn7kCMDyTI/YuiqMoiaM6vTXZ0TuJQ47erBoC3blz5969e1EUtVqtR+qjDW1fzrm9vb1er7e2thZSZjiuJ/1ovdBkgsJaG1lj2IzGNvdOubqhxOXnO7kMhbhaKRkoAYIBLOCqmgPN4UY03EE+xMSGrqfIAoV8G6loNoRMTLGlqtDteMhBxySGHlSPUCmG1ljfTKSuDjFIqBrqD3rMsIZZIV4FcKG9TlVzVafqpEz9SlAAhY1hyMQEQwwYgYGQalS3LJVjK5750Aol9cxMQZAmYc/DmzpVHY1GWZbV2eJHUoBa35xz4/H4UeWsvuD6eOFg/yewz5GMzQE3rvtsxb7b9oCTbMje4bEmRDwyBKpCgFwGG5yP2HlKqtj3aMgbhqHTAxhQeuAY3IlSAnEVh2OOAJqJdzBAwjCEhkUhfuA27wy3d/Pt3WL57nA0crvdvNd3eSGuEA2yFSrPCaRqLbdaZqYTN1K7tJScPd2c6djXXmvYmYhbERTIPDJX8qjPpmRVjHp2UiKDY1NdNQ45dL8OqUee58650DccENRDSkyQ+1DerKp5nh/9WccGA5NzKA5VKFkmQ8GM++Oz9xQCYd5flDiJiEKzrfPIcxltaTF4wC/+JCFQWRnrHYZ7LDnDKQHEId8V9l6UIJvrCzp4PYrPseXOHA8VLKFhQICXeyujbre4dLO/t5Pv7eSDfl7kUuSuNxTvJc/FOQ2/RInVqqBZlIgpMhRFI8OUJtxoWmtNu2mTpmnPRBfOt86earxyohHNRwBQOBRhGcTTxEEWHCGK5H5m9X6p+pqiqV85Ozvb6/VGo1ENx2vK8gGiH256eBDmbXU6nUmu8yhZdKzdrK82fPhJonaS8QYd4iy0drO1bXVcAtaAjlgYAs39cE+z0WTs8QxYIIHL4QsVR4dq2emB9QGPvZMcx1T0hDEhIWzKCvVes2Gxfm+8s53dvNbd2s53d4tsXIRitdyLKtSTlN8uRBy4Ni0VAPAQx1kmRBgMlfeYiaw1ScqdtjWq1mtiKI04iqhBGmptjtsM9+QUgMEGxkJVVe7LujzMCfVzNRR5eAUIvY6h3yVN08CiPkys+IAUn7VqWOl+SXy9vwjtP/7/qXvTJrmy40rwuN/7tlhyTyT2AgqFquJWJLtJSixxWmo1jfoimc2M6VN/aBvZzJ9rsx4zWX+SyVoz0ti0KDVFtsQeUSJZLLKqUEBhyy22t9zrPh/uey9eLJlAAQmQSivSgERmZGSEX7/ux4+fQ1CvUqEqIS/Yn70ICuS9F1+yPyXkzK4RMZ2jWWcehZccquo6pLxvAbhR9aO/f/zZZ7O///HJ6agoK18UXj1UlBOKCIZpI+IaQQhtulmuYdrWV0RFVFScV1Wdjt14jKdP+f6D6V/HnKT21s3+lYPev/nt/a1rWZQxcoHTiy+KFFBEjCTSQU9E1ctCk9cKNJz1fi2tbr377rtJkty7dy/8UxgDd0dXq9HfSkPPZjPvfZZlly9ffuutt5Yg1NX0v/ZqauJHvdckgY3O2INYH/gd9GMONzomsIwgeUu/+1ydwItuhInAFaRSi/22XTut4OzP0IPQFzwiBjCkRE8ezE5Pqp99cPrBB6enp+WTJ7n3TlUjruuyKCZDZDmYLVCQ6qoPgC5upNQXQbCMVq8sXkXhiXzonqFlKaUrP/6Yjo/KYuZuvjW8tJ+9fb1fY0dlC8hezAEgARvEEYZ9dZVU1cJm1lnFbltydFEgY8w777wTzkxRFACCdnR3lLb60Uod5nleFEUURQcHB3fv3m0PwII81Lr6BysSQ96LF78xlCSR8y6SDuiPFafcedmkQr5Q717HPsAiF2hG6hhB7RoUqBrPqlwuaERKMBBDpei9X07u3Z/8xfcfj45zESXROCbLSCxZw9awsUGba5GlEfYzV05fONrarAB4CBQuIlF40dL50klV6ZPHsyeP8eGvxu8+yO/eHl4fxvFOzJFh9uFRLqYaUkBhDKIEg4F68c67uROv6lKEdRP/aidgjLl7925RFMwcDkDL/m+h1bWIX4D/8zwvy3I4HB4cHLz55pvdS2PtM1ntkusHFK1KL16GA83SLgayPmwUK0UFUYAtQCAIK6pqBl+92E7M5yuB5r+hiHEVoMq1GTMBpN0NV9KzeKmkC16/n68PABKCASr96U9O/8c/Hv3t3z2ZTl1ZSmxhIo4jtpaYKG3ymjWdJU3qwGi1UfMyoShEryg8oMIAKssiUEEas/daea2ceq9FqT/7+dFHn5z+f/989L1/d/natf7VN/osiuqCpmlKEKSRDlJsb6MsXZ4754J1r1vSrG1b1SWtq+7B6Pf7165d+/3f//2/+Iu/GI1GoWAIKyztVdBOzULcz2az2Wz29OnTqqp6vd73vve9d955J/DeuuEuIsuB3lxQXQ198eK9z4uqqMqDfQz7CAthjfn5ehNEDeHeTsJUqRkSCENZI++c990f/eqbYCjUEZTOh/J1pXN9meuAACZV+EIePco/uTf55JPJ6LSsKrGWEsuGOY7YmKAfQ4ZhmIjDUKbGEtqTsI52KFCSwD+nWq21JYx6Uq6JiEpQT/Dii1Lz3D96kv/qo0lV6WA77iUcB3FjvYCumADDGkc06NHhoavKEJl6lhTCWqHM7mSq1+u9+eabP/zhD0ej0XQ6TdM0EDbbPcbwLVVVBfXz2Ww2nU5ns9lgMNjZ2XnjjTc2NzfPKXhWPz9fn/Lei/feV86Ll0EfaRLGWUvoz+fIiiGdOXUv3H694CSYVMjn9a7+mWW+Lui9aEfpgF608ompOHEnR8Wf/tm9D381uv9gOuzbfo+z2GYxM4GJIwMmYqNMZAjEJjCsW3ZSLVShWCLGKXG9nNO+7NIiv/BClZhI1AsiKyKaxKbMuXA6HpV/9n892BhE6nH7zuDqjR47guqc4vuCEwAFkCa02efrl+iTe7norMiLsizjOC7LMtATlkJ/qUtGZ38XwO7u7h/90R99+umnv/zlL3/wgx8EXtDm5marLdedGMxms9FolOf5dDp9//3379y587u/+7uB3bm29FoQjGpup6As3XpL5kU+Gk+LIr951exswbCfgwdzAtdKc3YmmERQkM9Jnb6GSXAXBiVfwkibPXXuAIBnLaetOF/Qc1wRQWnd4a9/8OSjj8Y/+u9PAWwNoyxhy5zEnBhmhjGNJbFtWIOh/uGFvN5Fl7mbgjotlzbYgyNWBbMYrVdoKsdewEbIwni1EY0LNx6X//E//+r9b+79zm/tXbs9sEwo5GVxISKTUR90+7r+2f89mc7sLM/LsijLKEymumegK2C4ehICnSFg+X/yJ3/y+PHj73//+3/6p396//794+PjICoaNl1UNVT8k8kkjuM33njjj//4j7/+9a9vb2+H/cbuYVuKuQXN8I6hRoj+oijyPD86nno3fft6tLcFsG/2NPicWCcoacMCIFIO8dbMC6R6HTDo8j2goqqvb1uE4byMTqv7D6b3H85KJ0lEseXIGGNgGGwQUn5jQ8wtAa+maPD6u2d5D7EZzwvVEH/TLbOSsJIGXhLVGn4EqKXYUQU9PS0fPSk+/SzfO8goZUMvZ+6k9SVgjA56armCVkURDBpdWwwtWWUtAURLtVD46+bmJhHduXPnC1/4wnA4PDk5CQ86Go3CFwS8fzAYXLp06fbt27dv397d3e33++dMu9bC/12DGedcVbmiqIAqsm7Q08TKOle4FwlFvKg81ouUQKoKKJPWfq/n4bb1Ylv9Nugiy6NNj/qsgo+AKBpNyx/88Onf/cPTh49nm4MoizkMpAwjMRysuC2DmeuCJ/jSa4dOu2RdTs2T6LQrS19ABBPWgxVGOHDTmUUAw2w8HJQir2oqp7Op++DD8Xiq1y9nO7vxYDNG8RLtcK0XoxHp3qbf2poVlT0+mu7uzqy1RVHEcRy64W4n2m5mYZGq2W1Yoyja2Nh4//33v/SlLx0fH//5n//5L37xi5///Oc/+clPVDWKoi9/+csHBwff+MY3vvOd7xwcHITNgYCKnhXuq3dCSP/haIX0P53Ojg6n/cG4n032drgXCZxfcIXuvAHNg+uaZrKNCwO2YYSpLyYR96IbYbocSM0qYhiI8UqJs6SVIOtLoDNyP6yZnBaPHkx/8sHJbOYMKI1NZMkaWObgMjM3XG1OV5hSiNZMNpGO4Ig2lLYzfn63WKKFTYF6N6lxr4IhYqbIEpEOB/Ho1J2cnvzyo93S6VubcU3S8y9xBnJnyewO+Z27+uTIPXx0enB5lqZx2XwEGKdr9LuU71tF//ZRq6oKXxy2Iv/wD/9wNpvleT6ZTMKxCVYDg8Fgc3MziiLfYCyr3IcWDlpCgequ1/uwX18UxWw2G42mDx+f3romV/YxND4Sh8rX70Tw0543AI14h2onnwYqYi2mI59n9nzhKNBF4fv6XNUPU1nIdOwOjwrvNNgPBNPhehOt3pxRVUhNb6tfTVHi0CwxBdZSGFtIXRRRB5tVKNq3uP4LVBpSSnONaYPcoVHsI2JlIDZ86qtJ7k9G1eY0eu5f8NwPr2wkSXR/Vysnn36aB6dq712rRR6ircVw1o6El6ZjLVHZWnvlypXzL/zwI1YnvudQ4roGw20TXJTlZJpvb8nBPqxR8ot56MVfq9frEhkCRUDcwoRLz7+b97v/8aIGmD7HODgEcqTHp9XDJ+X9RzmxZimZOuyIwxo9xAfpdWUP7eyRETE4NlFm4n5sDMcJR1lsYo4yExliQ2AWVXGoZpV3UkwrV4mvxE3KfOKdUymcLL7EAXHw4r0aUSJiA68AW0QWMev9J3nSY5dX1rx0mnCejQ629EtvkzXVX/7Xx4+f7DLzxsbQGBuWDLvw/9IySnsDtNHfVfrv6ppgxSRv7aB36QyER1gCo9rxWdv7TiaTo6PTw6dHT58+vntLvng3iqKSHOB0JXp1/T7f2mhRQElAoq/5BiACWZBffrpN7qxz5Rwg1YX5ABGeqwaaM8LJEBswcxh6i1MJREyrLBDiKIaNTTaI+ztZlNjeRpxkNs5snBpjjbHWxMxMxpKJmAwZy6axMAt9lC9FRVwlXlRFpfRVqeLF+arKXTFzs9OymLpiVo0eT10pfqbwpArx6r2KqLrAoyBiJsOd0fhL3AOi8CDnL+340RjXrpZ5MX16GB8czIIZTFmWXQHQ1i6lTfZL8vlLLcFSl3zWYOH889CdNiwhP3meh2HC4eG4KKZv3i4PtnQ7U/IO3kM6vVc7gV9gF7aXsi6PmOZZzs7lBl9XCUSN2ff82JJqU2CHZqBdUNQFNESf5QCga4ZqJmab2aQXzYpKnYqHMNQQWWKmKDbZho17dutSf//WRm8j3r0yGGyn/a2stxHXcpKqZ4jUyrp9nXYJVUtxs9N8clQcPhiPD/PR0wkz55NKj7ksACdOvVfyXr2IKpgpyWycWiKuS9uXgznghZ3f2/LTHLffwMOHkyI30+ksTdOAV3a1ELu+pUupfS3d7SyTubPifu3x6DrLh+gPB6AoAvI5m06nR0dj5ybvvlvtb/EwFso9XGjROgdgWViy3fhb1meds02W7FZfUwlEJGkqPuc16T20yDTvacgv7uGeM+tb2WEPg9nCXbnWN/3kOwX9+K8/Oz3MYTXbjLd3kjvv7W1d6r351f2d/aGxhoiIhSBklERJFNNJTdnXRuytfo6+adZds9EjIBCbOXrKBEIcczSkjY3s4GZfhaAswiLeSfHpz44f3xt/8A+P7394Oh2V1YnfvpJlO9nXf+dgfzfiDcLY10jqi98ABE+Y+OFlXGX8T7+N//h/Hj5+Mvvssy2AoihK04SZgv5m2L4Nod91zuqGeHdjeCmgV0ug9USYdVdBGDK0RX/I/dPp9OjoeDQaf/bZ4WePH+ztnP7B78WX9svIehxXqJrdulb1beHH+k5M6fy/xaVYBUmWqrWvuQRigVWQqrLOc/9y6qoPKq2Dg9bFP637rAJOTA+bu/F73z7Yv9orps6wJmmU9uKdy71sYLf24jT2BA+vqBr0xweUzTehrx2BQ+2I9zd4Z/gDU0u7aHadOXgeG7a14Y2xMOpjXLre629Ew+30rffysvCzvDKxibPo6q2sFwGuugCGdC2QqFS5ntHb1/X2GzMbyePHJ9bGWZYNh0NjLLNpFxdbv5Y2+lcJz0vR3y6+nHNjrEa/dDQJF/H+KpCIptPJeDw5Ph49eHB05crs1o3y8o7G6lA06X+ZO6NYcFXoZtVVhpCKqIJEjeJ1lUD1SwNSipQ42FsuhG9HmaEJf1rWzida/gVxri6bF4Lvb0RfvLv5xW/sNsNB09RXAi0wzeEFlddS4BVemv983alL5+k1uE+3y6jrN1rU9iTAmNr1lQ0CrzpmMJvYbO/G2/vZ9Tvb4VsdHIMYitMJ8kqfSM3xuoBFCNGZiyO9flnv3AFF8uO/P4rjZGtrEIQ7Q+5vM/HSEKA1NeqOipcUc5eOxOp8t3sPdCWg2y2R1jUsNL6z2XQ8npycjA4PTx8+Ovz2+8UX3vZ7G0pHgsLD++XpjGondS7mKcXaQwEiBQlFYSD1AjZh9vOGfv1ygNUOVI4Vfg6rKxqrS69gaCOE0rx6tFYnWc/vhhs8eFrCi3qhQQxLMIBTOGjp4ASlR1FBFdKYzYSUL+0C+/krRmd8gWndnqi76qncTN1iC8NkLWKGIcsEL3CiowKlg3ON5cdFwMWTgjKTbCff+BquXpaf/ez+6al89CuTZXFVOVU1hlsl2u5btuQi2kVC194GZ90SZ5EduqBnWZZlWcxms/F4dHx8cnh4/PFHjyfTo+HWg299Xd59U0gc8hwzXw8gaR3+I0vNgIR3dtVqQWGUIrV9oegsaYxXhgKZCMToIKEKhRIFnQVufhPCuuqfnjcsaF4FgRzyqpY5CbycSlAIvKLyKB1aLltYbNFViYGzOm49+x913it7qs28WeAIniEKw7AeYmAAYojACcoSVeP6cVF0ERV4oPQbQyodrl8rT05m48loNJolSZqmSVX1iMjaqB0IdMXb2rS9JAfUvR/WRv/aQmj1fggz6S74M5nOTkfTyWREPL19y+/uoJ8qylD8yIIr3mpe1HkVvTh0FV3aYyIijl8fClQfLzKaDDWPRQoW1+3fKewFKDrkz04MoQuDPpPx1xFMDdW89zo19eQ5cPZDml/Vdm59mUjXUO66fzpnibkr260dgdFgZlkRiuBmFQqksK2kUEXlm9aNLuwAeCAXfYL9a7p5yfwv/7P81V8d/c3fSJb2nBNjQkOcEnEg87QukUsZsbU56k4G2up/7fhs7VgAHe+wFvcMiOdkMjk6Or5//+mn9x4fjT5942b+H/49ru5r6r0+LDRcjGygQgsQgSxnJW15B4GD3EwrG7FXVSNiJR6oiV9HCTT/AWwlGqpJVGcgN0+WYexvFNqN/gZnnEtgy3q8XxdrI1os+hSoFKHGbS26hANR7WylCX3uAaLO2XBnMOUWDkY9jld0D3vztqGLCb9M+7vwGUVZ6RHZ2N99KyqraZT4//b9T1xVloUDqN/vhegMtVCwjgwR37VLOgvWfH4yWLfrVdWqqvI8r6rq9PR0PB4fH5/84hcPHz56eHzy8A++N7p5w129ItFpoROnpSevCKPUjjw3LdKAUBMtpX5ltR7yQxr+Vmi/yaiJJR7CJFixArn4G2A+TCGGTYUtB7JLSHVKWO1tleaJUFsX2HV6t2uwoEV4NASWdNtKmlsLvyz5QltN1s61vOTuump8ocvJa+liuVi6rAIiKISA4bYcXNKbN+nv/ttoVvSOj3uj0QaAYJwR6p+ukGjI00tGSXhucdw5Kttw71q77LA6U5MdimI2y0ejyfHxqCxP43h86w139YpPI9XSIfc1ofw8IkC3Xlgcjc2zf8MABSlZ2FTZvtgr/eI3gGabalNxRrv2WaLgluop3NEG6kSDntnsrkl7ugZdhTY0nvAHOTtxNq6s2jmWvD7yzxhQ0Pk0pQuY9X6uE+AV0wIlIdbbl2n/khud3v/xP8x++tOx97K9PfS+yvM8y7KNjWGSpMGpNxyDcDC6S4MtS+J5sn53cBYM4kPEh9WZyWRSFMXh4dPPPjv+9N6TD3/14XtfPf6tb42+9U3qseh9h5MShRB0sSnrQOSyBPc0paeKdmdkvpNd2aqJfTKkKEXH+fjV9wBs0dtTkypFpKT1pClkz/oioA6OH9oC1aDD0wgeUmcOchYEtCpC2KZ/alpDrJN6rr+4GUXTC6fctWJ9eB2O9msjk4PaI/S4IG+zof3ud2V//2Rnt/jnf6bD42GeV9dvFJubA+dcr9eLoijLsqCEFeR9uqpy3f54aZV+ddpVK+I0aE9Ql5jNZsEA7+joZDqZ/fKXD48On+blo+9+97P33qu+9EWf5KKF4qTUwsPLygunpN15fEiVMq9zOgtiWp8FrQEOgZIVirm/Jzaj11ACdQ6AobgHm8BEbXlCeq7M4QLkQh112yW4hxbjXpYflD5v0tV5ojn74lneEF5Tg3WnePzrNHUNbWHJKNU4PdjT69fKp0/lww9Py1KOj/uDjQSEkO9DG9Cm8K59y1oliLOmv939xoD2OOfCASiKcjyenpxMJuPp8fFJWR1n2entW/m1K7q7BX3sMQvAv9Tc5rMwjyXaiOp5SSn8I1uKEkQZ2dfSBLd0KzGR9PfI9JgS8UIC0kDJC79jw+AOoGRdClEHWFzbfnYqET0rjmnhZlmeDZ6tNKFnj5xX1/Z1rZmqfg553wv5OAsbCwxTER1XKD1x/O4df+u239m5/9HHyf/zV6PTyXg42L71xmxvbyNN48FgkKZpHMfBsTQIrAfu0Kqv9SrBoZv7q6oKgM90OnXOTaeT0WgymxWPHh1/9NHDyWQi+OS998bf+q3pN/+1xF5xrHhSoRRUAtbllaNF+weVRThhPmCqLwFVmZdCAhVREwtl0t+luNfCu6/8BmBmtolLtiUaepOhagvsIF/O7Ux7TfFAi9jIEs4zB4Lkc1YGtMZKY0FQRp9LkyLkJ9Y1sE8XIKLXkv71WZRBASroqaOM0wRv3/Vb20XpDu99zMVs8uB+NZ3M0izd368Gg6zXy4K6bZrGUZSEA7DkKbZ0ANr5bpv4Q8VfVdV0OilLd3w8fvToaDabnZ4+jaJH+/vTu++e3H2rfPMNn1RCM69jQeXhl1U/n7v8XBQpaDrgdkwsJvXRQOMtsr2uMcKrHYQREZlI0y2NBmp7GnAeEQ00GtH5JuTzWbCcoYmh61pbXXtnrGRlPRPAOQcJPT/BLxBG9XW0vvQc8SEeI4UoE9++KZcuSdov/+avq3ufnDy4V02nZZL0VX2e9waDXr/fi6LIuV4cV8wcRmbtrb56AAKzrd1sFPGB41AU5Xg8zvPq6dPTe/eeVtXE+4fXrz/e3ct/73fLS3vYGpA+8Rh5TBxcUx+f8fvU5OBlo+UOe0wbH/J5+q8HZGpSjQaablGcvUAH/II3QBRFIqmLN+zggKoTOjbqKxJByJyd5yCqLehCdY9MjSN8F/nUsxtZPTMaqG24F8kObSFFHa45nZ1Q+ezzSLoQ+quJ/9dnIQnTmZGPVQtBSVnMX7hr3rwxffI0/8EPpx/+4unxcfpP/3QQ2Y0sG16+vNHrRds7/SxLjLFJEkdRzEytdPmiQFgN9YS4L8vSOZlOZ6PT4vQ0f/DgpCzzyj06uPpkazt/553Tr33F72xrrw8ai953OHUoBJV2xAjWvJVKRK069BId9Cy11XAJeIEjSXd0eNnFm1HUa/1hX/kBqH8MMUwKzoSNCdCULm24fW5Q8XPH0/OUNPpykPyvMcSfv1QShWMUIGicadxTFX/jRundaGOjyGeJd060nEyrysXeV2nWiyLb6yVJEgft/uA23/1tRaQsnBfvnC+KcjYrnPPTyWSW53k+AUZRlA82Tm7fGu3sVDeuu70tGfQUJWshyAVVkIRZgnxeCIFbuhjqCogEBJPBZGCDFWvAVzUImzscAJptSX9PkLJ48m5hkr2A587ZoQ25QJtu5axhqa7P07pYkNCriWA690e/tuPxuehSXjABZl6nQltmI+Vvf1O+9tXTyRR/+/3JZw+Tp0/ix0+GxyfpBz/bSXvDJIm2Nvv9QWKtiePYWraWTCuNKF5Ei1wqV5Wlm4yLo6NpWZZlddLvj4cbkxtvTIbD6s6d6fvfKbOMjEYYA8eqTwtUAgdUOr/qV8aDTX6vTTCW8TaZr8A3qFdXdVjJA549Ysl2tL/LIDOPyldfArWWtNTfIT/2Uc9oCTgRsCiJqlcoyBDLwoybsKiXqKvwvKyU+2dAIQsiP3rGFOxZ1w4/q9bnZ3ULrxoFeubx6H5NmEWq6JHCElJKh5QM8W9/r6jKvCj0g18djUbm/r0HTw/7s9ycHMWHx6l4C/TyWZTnMbNp6h9vrRsMZ9DcmCrpldduzNLM7+3NdvfKvb3izVuSxBRFJiWmkepJgbGDa3RRpTttrIOAPK1cBTqf9SpW55HU0maCzblAfe1rBTZiMwz20N+ljkn46zLICOk76mk0II7gaIFtr7o6OdLleKUz0P1VAP7zBw11MHui84YDa7xTny8if72l0RkcyjpTBt8aIoqZlHqRSqRZioMDNxhqbPLhpp9N+VEWjUeJc1Z1NplE0SRito0Yj49iv7k1IyqiqBpuVJculb2ebO9UW1vV1qbfHsIawAlKQaHIPeo1jBWu4eqrfdaTX/OdXQb0fJuvnpGRRdRDPCB68Y27F4RBjTFsLQb7UO8pNWrVg6Sxu27uLDGtIlvggfLaeKJ2Hs8vmhT57H/lZ2E759wAZ6JA594hFxjl+qwRga78piEBOUUJzQWWqUecmTjhO7cAKL44VZVZrvc+w+kRVyVVPp5MoskkIgo7HSAgiv3Obmm4TBLZ2tKrlzlNqJGjNZgqZqqjEjOFExQ672DPegFZO/cBqMVAwuf9SiEgHUp7uJZCceHCPcDCKfqXeOOKGsud8fbraILD/lGlfU02XP9ypCOUx3Bcs4IFc+pbQOt8YAuvmMi0byA/d3Y/M1Llc4ckPZ9DCZ1bGr3SEuicd1POKIq65GKn8KKeMFMYRqzBN5YSTgk3rpDbDxRj5733PqcgDxzCnNVYJWJijqzEQphAC4ETVIoS8Io8qKV+Hj8E7q65r0WxZeUa0PkWQLjiRJSs61+WdAtRP4rjgOe+jh6g2woTWzExkg2ZpkEUovbfWgKC9FnGYctfp58vGp7hM6DnHaHze1v6jUeBaN210P6DNCCEJ5iQhhQRg5QtZQlgdc7uXj1VQUA7PGahcIoZ4AQVUAo86nL/Aod8Z8gBNQTzOcVYKdJkUzlhE7VM79dRAqFx6kySpCxLJes2bkX5Q59/YiqnFqqG2gZfz7nH59zohTPwAjHXUBtfCujUji7uvwgwdO0aSbe2Ni2diiCAV1QNv3ISCplGN9i0W9GL81oHiNTf6xQClA0TaTXP0LpFjzNbrzmm+ZxmKaoqIf078TA+HrrNN2HTsALaGv69phtg7tJMpL0dHw0EMcNRDVfRHLrqWjotrMWsSwf08qilvmy06vo1mN/cmQA9xy+yoMiqqFCLm7aeOasPFAwDtfMH6YymqJPEutFK9Gzw4vwd1Zos3MFUGq4xfD0SFkTCmfZ2iS296ATgAg4AAJBBtiN26CWKaNHqVXWZ3U0EgfLqK90Sop9jZPKMcDz3AOj5hf6zyKy/4QdAzwWsugSt+WJnR8QMS8KVurjKKnMGf7vnOZ+1f54DsPr4K79PxxSyUXPqmGiIWE8ZenvK89Wf13oAWlo5bMz7d3H8czzdlOqEDUiglUKgREG0QgyxthckLcCh3F3ePXcCRGdH8ALTgV8cWW/AiTWNB/2LGAmfgRS1f7UrBn51jaQrolRnddy8+FJwC+Sd+dbxWaBW/b5TuyNWc4fDH1WauFcPCfiPBzzUicZDHR5g/21K+meZ/H3eQvJFjoG1Nopi4UTizSrdV2GtBXk6tI5lJcdFafX2b3oGVY7OwB9XZwh00dHz/JPmV/ffiz3n5/z2bjbhl/i5L/YC1jeHPhcQXIM/ql7Fk0t2fLqnJrU2DhSgl++kXgQFstZaa5UjF2+Wya6qhRCcLOu7r5lunPt+PPOV5VcW9/+iP17mIFEjD8mv7ADQGVzHlv+uyzvA8/lXoBg7hUCFq2SnSneVI2NtC4C+1hsgECKCsxoAZDuyeVs4EzXwEIF4qO9m92Y9RmhhHNatMZjWvJHnHJVzFX0W3k5aKWYWPnnGD7vwmLjYmH6e4OZz3+Fzbtc138gXMP7oeHQu9YdhXy1slKssnIeW9x1mGp4SHd7A8Fows4mbIcCLPaOXMciYNx8SZZRtO4oNcqgLVBCVs3fNn9GzPstYqxavDW9K8+1LlHHSz9+50isk2L3mJvjFIBg6y6uh0cpue7a2NfBNk/qcEJs+F0A6vwdEg9NPcyRYKNZkU5NhW4m8zItnXzL6awZStoOtWxpva1WqL6h5uuoUALHCN8Bzfa65+3IviEc9ZwhGQEpImeIawNayocGEJsStdF10Dv7zrK/5TT4Jz4x7XmzD6GxHkqUvMACkNtm0zTsYBbXg5v2dST0g0+d7qosi+YvfJQ2gFNQfVL2o1yACUHfDaiTa1I0btHENDS/zhesfvCQZLhyAOI5L7bl0O998i06cnZ5KpQyoFQrrkQIxQLBPJWrhY9KVvvd5oj8BiMqZ//jnxa8+Lj69X4ponNKV/ajXMzs7dn83SlLubRhKCQkDgFcNwi01LwNrkpau9BjPE/f8G3AA5DlOQndKpYvPnzoFTiOESqaeD2hBWqob+8NjN8v906fu6MQdn8j4VIiwuWm++pXecNPsXYprcsT5J5MWT4J0JbqllYEQ7bgoeqhXOBGnVJHYXr551/f3kQzSJHnJ6H/ZEigMBIwxxFY4lnRbJ5kqzfX4vYJpvSUFn0ttWK8oqABgSBSjE/fZJ+UvfjL76ONcvKY9zq8lg6GZXYp8Lr0e9/OY+2R6DEtGwQpD1DC5GlMFNOtpC2qTumZOh4vYrXlFH7wutZ/DC1Sa76mEX1Zqr1GnKkqqGpxbROEnXmZSnvrHj8vJRB4+LJ88cU8P/emxY6KNHXuwza6Kt/djXhW8PKvI1HVf1KU8LLhkNP/gocpKsc921KTM0ctH/wX0ANbaLMucczlHbu8L1eyhH31o3AwM8XVfQ0HUjgJTCBpQ4zlz8Fnjp24LZQDF5NT/p/90+KMfTP/xx7NBCmNgLf9jNGOGYVhLzCDDWUa9Dd67ZHb3o71L0d5elPXN3n60d8mmfWP7hvoGtmnIBFqhvXybUZEu66HoSu+ov9bop07ot68qLzYzUd3rU2iZuGmfDGkuqBSn1WwiJyf+4afV6MSNTt3HH5XTsX/6yB0f+qIQ50ScisBXqJw60bKC9yg9Pvjn/K2303//H8z+tSTpMSZyZn24fNtrCIlaWA2s4qEICiMalA+D00ONravnrEq23P6XxfYMUZZlYa//13kAmmlAZOLM77zlTj8qjj7I5J4631igKTzBNMkm9FK1hjMvEMWfp/4xVBU6m+rRE5ePvfHoJRxZGILhujGGUyiEZJajHPnxU3fvgzK2HKUwlqLYRDGxIbbc24JNqD+0aca9Hm/vxXFMWY8HPY5iHgxNr8fGwlimmGAJlhb4Qr6dZXQIAusWGVSWEOCzGXjUvV7P6FIW4CxaOAOqEGgl8NBSi1xcJaOxn81kNpMy92UpJ4dyfOiKUia5TI+8K9VP1Xv1DlXunUPlNJ+Kd+ordWUtQAgFK4jBlmJQZlB5jHM5PnZPnlaPnlRb15Ik4vlK0zM7ljabSLeSC5TplmkXyD+AgwoX0X7Zuy6775h0GKS+Xgb/uYADUMdk6IPZIBpqvOGTLRl/SoH73Jj3BZ1T5SAh+hyMh3PZDKpaORUPVkQWkQEzTO1Y2sw6RVXhPaTUgjCGryOmto0nIuptIk6ov2l6fR707eiqSxLuD+xgyHFCm1tRr09RRCYxFBElxDERzwV0SGtMj6hBSWgZ0GgcwnV+cEjpHICEGjSrPSq0UDIoNVi51jVmByvU0JhKIVqp5prPpCrl5MRPJzKdSjGtilwOn1RPH7qikPFERke+KlTL5j5ulJ0CqTcQ2IMXLYeylCAGUHgGCJbgRSunlVMB1oheEc7YEacFRl2H+AzVsFWidRGmof1VD8k2JdlGvAGyIfBePnovpgdIkiRN07FzVf+Kbr+bzj4iGXPlEZGywggMiAMTTklXlApltZs8o5xUjfuUeu5vml5GqUFiEUWICAkTE5nGllRbrFmCdLp6V0dMkNfzitljzIDjB46JwKifINW7ykLBgASAskUUo7fJUcJRxHFqooh6fR4OTZJyb2DjhIxFbA0ZBDdLZjIGcULGIIqRJmwM2YitgTWQxXNOCi8Qj8ppWYr3mufqvTqnriQRVQ8vIl4rp74U53U6ldlUpmM/HklVSFUgL7yrdDZ2xUTFh7NDAXuoxcVdHdY+oHN1pQEmMIMJxtRr2sYwNbUSOnOq4IokisJrBVQxb23a7W27sWOspWeXPW2lL8tMYW22qeozoKghIAFKEc9Cab5512/eVhMnaZqm6cvMvy7yBmiHYgA03ZKtN/xnPfIFxIUduWDjBIJ6ohZmqVVU6LkmAO0tL6CesYT9q8lnvyzTrIgMIkZqyTIZwDKYaVGaJaQ0Eq4LBFVSwEuLMtept5EcDpdHQCBEG8u/GWM2ETYU4pgNbExxwtZyFJONiBiG6kY7LCcxwUREVHcpzMHbGKuXNjVrHiLwXkXgnYqoeBWlkBRFVFBbsqpH5bUqpSqkLNRXUA/nRURdqb4CpLmdUD+rtlwyBGuJGl0VEIXqsb0gman2j+3omEnj1xp8pxRQDxbZ2rG7B/H+9SwyFPyT17+fa9UMtOuOusiaEahvbgBVReQpk82bMrgMINQ/Lxn6F3kAQhtARJpu6cZNH2+S5irTevPfd8wjG2X/EJvBSbcZW52t8d+dvCTGWL50M97+wGRDWIIFohiRkiFETMQEmv9iIRWKgqI6uKUxXggC255qCK42VfL1bKcGoAkAnIcrMatQHx8VpY7d3jNBelqOgbWU8IWNQj1TUqT2XdNaJ1Kp4TU3CxaGEfCAwPNvIE2YCEwwVHf+DCwpwtW+mES8pCqmTUHuuSJUrAp1BkzYuRTtX433riUYO5SyPD7TlTWdNb7ROgd8pAGsm/9XhYoKxT7a0I0b6NcHIGievvwZuIADELCgYFleYMuBp9tfikeD5PhIc0CUScAMW7PPGw8ZaoWBm9WZ5l0990LQqYsMvvadjXIq02M8/qeROsQ9mybEBGvq93teH7r6kZqWlZqOlHzHN1Wa4jNADgKoVwdV1VLhg8yHwAtE4LnWMF7yVdGVgahyffL5WSilroL7BCUYWT8naZuK0ISAYJiCVY1RhMswImIiVrABE1muR+ch01umAEzMOSgN15Mb88H6mhA4H8SHyKgaIVdoxNi9Yr74W8PrdzPainTsm4Wbxbp/oett+5XaXLElYs83y0LWd0pepFRfKCou+5enG190/WvU2w46py/f/l7YAWiHYtZaZ6OKI5/t+erUK5N60mChrVCilnQuNBfboc+py+/ARL1ts7kf7xzYww8IXuuClckazLG+EHzR3Ii2FpRs8jY3Jnr11odAAaNwXK8xq0KUTO0KCGHAQwmhmmrfP13SvejO+xlYdnY+cwKrWLwuaGHMRYtAWcssJ67PQN1JNUxBbnybTECHGx5DMLykgJsJoGTaDQ1eAJZa+k99YYuK1A8iHmxpsGsvXUu29+M5cAx69uHufkpW/l0bElDdwKmHcbbve3tqIiITlH0vpP65sBIoVEG9Xs85J0r+0peqKK4++1vyY/JeRFkbTxtPChheNANfyG26QPhZ6pIFmAl53riVXf+in4zcw59OipGHaoj+yHDEYMAEiMbMA6VeV65Tfq1m2uXDS42C1HKuXkmCD62qEZCnvMnkSiSANGZoQotGGTrnQbU9j5NlGSRuLInD2Zv/8txk9/A4XCPGxMuZoR3ZhXLfNH81DMtBLg2GkDHb0OMyGLDNRWsAsvUssPWDXVUbEkVFIBVRqIN6Yg/vJR3aN7/Wf+/bw+GA9WmJQp6TERReNVrwgQdqutt8OUFExUM8Ku374Rvu4D0Pa5mD6cFFnYELuwGMMWmaFkURp5naNz3Z8d6/3jz+kSmOxSqMsBKVgGUAaigUDIyQUnhFNr1JrSFGTCe7BnPIk/LatXj43e17P54++Th/+vNpP+PwfhMTEaImLwLhMySNO4Noa/G14ELrBAKUqqFIU6iIkuLaJLszSm5O4o+zmQOJ4oSlJBmzN0JQOOiR0YK0UA8EE5SoKQWICCz6wPictWoC14bk2yR65rnviQXHStc8avW/ViNTvYKEKIWJQHuOLECAZ6TKPTEbWoNtV/JoZuWHu7PDzFVGewwLioiMARMiprgzKAu4RLBcbqWryDCCDbVCFUZROfICH6k69V43LqV7t9J/9e92kq0IACbVM6K/9SEPoR9wnvC/YHMogcSlqASVwKmUqqVC0vHu19zOV7D1VmSTOI7D/OtC6p8LOwDdKiiO46lzZDLpX5ZRJtXIeN9kXSXtdI5K50nfnNMNC1BIlJjBpt25kVSlHP1yFl7ZphYCMdUpdgmqD7VQDQPOB1m1j5kqK5ihIBIRQyJqiTckulzEVaxCENCWSgWZihhlKDzkVGxJVIlXVCBHGAAAVUQWqqTlNnxO2tx2RJoeaXWICkBGdI0gDTpgNbFKB1qESUNTEtV4lRAnMBa0pWrIEIwXSlRSlb5ykNg5qOwpxFKhDG9ASqHbZYYhigyZln5Oc0IQdWZxxIAGjiGkvoiYIPWiFnS4Yzcv2Z2rCQu1q7prqlk92/BqeRNgfjW3JakKO8TaP5BkUzmKo+hi65+LvAHCYCJJEufcZDLxJqWD99yT/27yQ1M5dSLEbAhGCRBPUDCr8sLshEIrzFgR/mvemVoSWfVUzJ5NtuwX3h9u7vKjn09criwBgqwhbRPgbXAoatWug1Nqw1X1quThNfS4UAEqrtQLSA0NJLlabfSKgiIyhrhRnrYaE6DwRnZJExb1dCIYs94hgOgQGKpWXp8YqohUYQAlNQZv/Bd/+F/0CQNvMv0fhoOBhAJG9gGu+BMCEyJCAkBRefIAbD2T1ZILRp9oIM4oxkKnoaDwgqGzn3EJM3WkDgITkSFiRAzLFDElBCKw4a5tw0L5GWpEkhDe3oWrk7SEqHrSa1/Krn+x/+ZXh/ppoaV022VId827O+LqhjsWNt8V4hoHjJr7oKhUvHE8KPe/5Hv73rnt7e0kSV5MAvGV3wABDmrdOSsdirkz2/2qsLXjH1OpDFUrVIVQFgAixkChpCL1sFGe6T3RlgSqY8eCW18Z9ob2o3+YfPKDcVFILzFq6m2Bek4XdzrgpRlb8ymvxErMcAon3lQqDDFwXh0wY/iY0GPJIjYkzKAo9JMljYks46qHAJXolMgQdlSfAB5UKfLwg5gsgYAU6gCX4AF5F3lrCIbYG1vpZSFV/pR0DJBQBESEmLQPiNCE5CogFZ8AHsos7woXyrlGDNlRn3r6SLVQrSi5ishVyEvkFZxjJCEvRGQIMbPluj1YUqaab8aHA+CZVKgWdFOvmk8lHtqN/fjrf7C9ey1B7lF5uGcqQHRqzS4VVLRG0gQQqXVFnWilWqlWKJLL042vyNYdTrdslGRZFgz/fuNugKUqyFqrmlTErrdvZjs6NhTKOyEVgTBJxzUVHbgt9IlKz1ilC++VU5S+v5Ns7EfbN9IHP55KLt6rKs9XWzhAe4SOnj53ScRz3oEKiKCsBFYVKMGh3iwQJliGjep+k0P5bbSeFvcUM4WCHDRRRMBMIaCgrQPASD2XTaAg9cIVSC0ZJhhiZSsaC4ly2zxHQKSISCIlD2JFDBJlBoRg1fdAqpwrFEiAoSKuaQO2r8Z5RC54OFPdW4cZCTNZUzcnSw0vt6B87cs7/4JwSYog7ZnhQbx7Ld3cjVDpvP55zo/lbb7mWEjjyyT1CEZhfDT0gwOxQ2vTmnIWhtUX93HBByDQM4bDYZ7nh4eHbvddJi0Pf5z4kZaVRlw3nxFIAQdlkIEasMxnvVDAUhcmW9hsbN+xSgFFUW1s8bf/192je+XJ/WJyL7cxkSUPS1yjQExKjEBEauHzqD0DXDMRlFUFRhkQ9XCC3KAiSGnFxpT0KLFAwhQTHwYciJESIgMotuvJAXlCqSDSDLQDnYACIbNq3vaIQBbUM35ThYA+RZYGDp8pvGKDcRtIVD8NpG1ST+QFStG9ejQQwGD7cXiBiEpYpzqx3ouqg1BSwXhHmgMl4BhiAAsbsWGAFRYEDY0vOpsR2tnlhoIMKs+O4IyUhTqn2udL72Zv/c7m7o0sMaQPZ3ABo6PlWe8q86/O9HXtU6NlonPem1N4FQdUqo5K2ig37pT773ml1NrBYNB6Ov2GHoAWEk2SRESMMT7ZLntXZsO37PSf2TkpA/wD9QolYlUJHLJmCaLVadIlT64z4DSvOhG2vLGX3Hyv/3TIHz4pKxF1FEWqHXOvBpGpAfK6Gw6tMQGiAiUlIlUJuKZ6CkZsUGVwimhgTEVgJkO0T+yJx6y7hAQ0AGZAZZAgcBcRAQljIHXtGwM54EOBR1DSgdEyRsGKiCw4ClxTE5ZQQIRtpRmQCwRgo1vgMQBoBCTNeLcieE8C8aQlyJDGrAZxCc4FeVtfaENz0sB0MCHzEETR9FxddY5AuROqi03npXQiRLs3kmvvDt740tA6ReFRPcvwq6sP2/1kw6yoJ/CBm+UVTrVUOBKJZoM3y8FN6e2zqcesF4X8vNoDEHhBIhLHcaFbrrqcb72b5vfYTU0l9VqdE1iGh1qFgpTUazu1pwYvW88Z6DbGIhiDM+rtxTe/Mkgy/vh/TPzMa6U+VaMQJVIQKYOElVEPfep7oP5xYVshYIpBDDOkd/WiIqTCoAx2w9AxmAmGeZeoIuuNHgCpMoAp4AkZKCjHGkJqNCUJ09E0FG3gcLxAsml1GkGtICILa4GU4AlEMgOEsK+sSjnUESIjW2FfXCkhDAADrYCZwqmysqh4IrBGKj1Sj+bweIJvqYHNXm8gOzCR1jP5uu5v2PnqlaRN2Rp2AEAJXX6nf/Xd/rW3+vpkilLm84tzhttdQfO5um3LdgZcKHuk/mSl3rOjtNh+uxrckGQ7TdMkSeI4vvD0f/EHAI2JGICtra0nT54U0bC48q3Z6FcKm/p7VAkxUQRAyRAqqEFdtFOjHh1E8JgWSMC8eLFyMyuqABU6yt/+V5u7V7PTQ/fzvzyePqlM4dPEpJZighIpIWJSgoCNWXbQM0Rg8ioEqEdFUgFOUQUiOrwaJupTtEGG2bBBQtRjHoIcMCMcMnaBSEigDBgmC4hgygEtUgaGUAIl0BFoCuxFethDLgpDBJpF2FO1tWohEfSUaI/0TcFPQRW0Al0DIiBTnEArokw1VQyBh6oiUoo6aMw+C1iRCFdABVSEKqh6AspKhkwYHxPUcBecqVjCVeBdTYXK4QuR8dQNb6db15Lf/98PBn3GNMdE65qOlnQXO/OzLqLUnAH1HcUcD1SqHuqglWqh6kSc5PagSi/nl74h/cvMvLGx0Q6/ftNvgKW5WJIk3mXOb+Ubt5U4PnzoqTRGyIU6m8iEUUhYsg73ANUzE+kINs2ZYq0dagvgKRQowN4PBvTutzdHD8rDLJ89KsgRWxjDDd2FFFDTXCorPkgqpASiYJuuUpetBIphUpiUrGMDYoASkAVZ4keAANugFATSY9AA6EEsqCCaKgKCmBMMYEgj0ACIATYwiUaqiIlAlvQSEAMjwQjwhjLVqWBKyIAeUaxKgAHFQAwYkj4wVapYt1VL8pWAIIYI0C2oAfqQCcRLM5CjBhlTIuUFzTZtRpGhs6lTM7QsxXk1G+bGVwf7t7PeRmy9YOLgpdGUpjVbPt23SJZonnX9o76pe5v/Vy/i1DuTb98s+zcl3UHUi6IoTdNXFP2v/ACkaeqcK0pXbt5RE/cP/568cFXBkVKtdUqAGlXfpOS2oyKsIVJiBR0KdX4F5C5L+O43N+7/bEIxfvW4JK9GJA64SRjscF0Hh3ZDuy7ACtH6AIAoFMEaaFtkwQk4VXOiDCZDHBPF4AQcyvo9AEAJmgApYBvZi1k93dIqPAWGgWZACmILk2gESAwDykj2gAREoAngGT2PQ6Fj1uuMjNETnAR9QyCBKniDUDEEuq2ai8lNlYBVOCdsQiL4AfSp1sSaZhbIYFBn9DWP2JrpBHhCKJxKaFGpMHp78RtfGx681UsSxkh0Ksv772t5rVh1r0E7+lVpuP++bgC0EnXsJC6Gt8uNOy7aTOJeSKPB0/tf0gEI7KDBYABgNpvJ9ttVtjc5+llv+oEpPpGSITAkyoAhYoEaVSBu0NHaamCdYsfqCxHo4yOH1FDPfvV7O298bTA98uP7RX5cJRGYDDMXLIYRgYkBglncRyGFDSbfDDEiaETDw9ZIpBo7RMegntIA5hBsQAmRIUSgiLADMGAVE+Ax4ZZqH5QSxlQjQjFAwFgwU5RGdw3imCygESJgAzojeKIe6U0AoISREgaETWAA3GB8CCqBEoigJErAkBCrphBlURgWFfgCPISr6iStAEONilEwg0Cm/tXE1HyMjuwsvMIJKg/nNJ9VEvPwavK1P9q99ZXBxqbFkwKFwnXlmJYCnRZ10hvTJIF6gUBF4aECOFGncEqVwKkvVAtxPJjsfLnc/7ob3jA2zrJsOBxe+PT3lR+A+aNbG8dxFEVOU+/7Ze9yVD1O8odwnqEqTL7VTw/LeBR0aObL8tIM61fFvmkRbQhDy1KyoRGNL72VwcvxzJeVcmiAVUPfwQ0hd86OCAVrYMPUf1pkIZMFp6AeKAOnNeuSuWGTOSgDtkZ7KDy6AbKmre6Dwm5C+HwKjRjGEgNqEAHDJmoMaQwwKAMqQgFEgJ3XEKFNqe01I6hRsiFrQ0IvFYMF7BppJHS4nUuqctRlHjSzKfUK58WJOqC/F29fS/euZ2nMRqGVtEboz+CqLO276NxHt6v5pjLffBfEzvTL3hUfD2EzY23Y+n1Fof/KD0DAQwFsbm4+flyWSPjgW1bLePY0Lh9DVCM1tu6G6zivBem1Y3umiwW7nmnfIoJC9UmZ7Md2N/rWH+/95C/tT3IZ38vF1/Q4Y+DicMCoXfsIPaqKhjMic4p9Q0/mCGaL7DWmIRklQ8QpEYgcGKCc6BS6B1hlIsQIxToMIYUawIAG0EOgBFeETdINaBX2JQGKMABuAk+ACjBADETQfSIBZgiYDz2FjgEBIqVTQEg3IX2oJS1AM+WSfETCpDF4CpwC03ZFPdzJQpB65xOhFQh3RE38BkpG5eE8ppV3gtLwu7+9cfPLw7e+to3jKU4KlHom7tlsP8/7t9XVxyAS1ey7qFN14oPDaIHS7BTZjdnl90u7yTBbw+FgMMiy7BVV/6/jAAQrscFgMJvNcmMq1sn2l0Vk+9FfWjc1M6fGwIoSEXkoCRuCMlNrmVYLnktnP2qugUPQxmINDc7nVU8cR7y9m779rc3e0Pzdf37qTtzp1A3ZWIA8qHHrq2lHYU3dNHPoztCtLpPIw3gYIlwinsCcKn8MTpneJE6JHMhDPZATbgJTYAJKAQGmUAsE3v0A6EH3gB4QA48N4ogywFnE0E3AADkwBlnAAtMaO6KQ/mdAChA0IWwABtgGV9ACGkEr9axUqTK4B+lBZsSpodr3NHQ+7XRcwpngesVRBQ7qg9djpUUhBZDtRne/Ofjyv9ndPYgxznXmUel6upt2sr7v/FW6wy8Jtb54wHkI1Ckq1QrIvXqIZqP9bxT9N6rBtSgdRnGysbFx4cSH110ChW44LLB57yvXl3Sv7F3ztk+uMr6EYwXUKITCQKrugGVF0A/rDJeoy+QihD3FSgCNh/HGbrx3K9u6nJx4neaV92CCiCrXSkXzn9BS8qhTx1JHeaQem9l6n9dWhIjIUAD4CaCQnrMa76cmBELckSJoC0pcd8lkG4VBSwhIcA9gYBpgJqCCEhCBTCPAEgEMtUAaBm2AQJSUNcy1KkFN+YjAMci0uv3UXHTtPkP4raXDzHcqYSPZqUaZ6W3bS7ez7Utxf2gxLuZDqwXW58qBWGh/ddmSAw0RWgAXiq1g42cd94r0qutdRtSP4iTsfL3q+uc1HYA0TTc3N+M4ns1mfnhdkq2TyafJ5KPt8Y80d7BGw3qSKhkApMJIPIQIrNScjbD94bu00HVrYx4oBQ44mg57Se8LW/H/Zn72/5789L8enzyoLGPTGCJWEBF8SIiBoAkosZKC2bIaA2ZlghIRxzAxIhb+lJiJU5hrYAadgAjIQFfBx6ASOFWUQEWYhreaYAECFdBtaFSfbCJgwPj/23uzH82O7E7sd05E3OXbM2uvIptLb+pdPXJrbMnyoAXbmHmZ93n1/2jAwMAPBgxDkCXLgmcGmm5Jo+4Wm2RVsaoy8/u+e29EnHP8EHG/TBZ7AMO2yCKZ8VRVLFZu50Sc5bdceTSg7ADYJXAGBOAAksrjtBbYlrIHaOcuYoQtAQfsgQwjtWTqybZggapJAimpEsPNxF9H5Ji57LrBZRYsoIK+iarJLIpeHSkLLPCP/+XZ/ff6n/yLOxgiDqMdBOmz1mD0KXgibmi5GSA4KZrAMMe6IalNZrn8Qm0SS8h+fbH72fTon1u7A7DZbPq+7/v+n2Lz9bkmwAkl2nWdc2673e73V0OKw4M/0P3dbvigy8+diXpyJQp9nUq7RFAzr0R87SpWCIun1VjlEc0U15siWwYblSy5rPcfL90f8/mT9q//p0+OL/KrT9J6jaYxZecVjuga/MgzA4fmR4BBbLAEl+GEuGXXMLfkEkjMJ+AOoQcyCvCI9mQtsAIdAJA5IOC6ixfYFrgE7YE1owvUwUaPACyBEUbAfWAPygAXPBzoMJfSKxhgHbADedjSMICOrJNJa9IxJ1A2uoIuoD2xJxAVKhkDDCNW4kJhK9KHRXB/Ep0mGyZVx/e+vXj03f5HP7+7XDsMyQ6CWHZe9GkM7YmvObv/yg3Pd5nj3orNnkFMVU3NsiELxDQRkmrCyPem7q3h4R9G7h377Xa7XC5LwPxTR//nlACFKlBg0t4HsJf+bpYhdvea4SVgLKZqJHUTTGSmRteOY9dM6t/hoWmz09tr3ywpgAu0y3Z7rwHr9nFrTMeXKSlY4FUd8YkweV0L0Y1hCc2GzkzgQCzgBtyAAWZjJbRAAzKQA3SmHfQFSwFzc6zwCeUHWGl2CZ7JwYp6gwdGgGEL0DSbPHrAgQIq4qwUUQHUAh4GIIGYLIAbs3a22AxEAexP65TXduhygu4rxFRUsyCJKtBu3PZRe+/9/ux+2wRgiEhWlPY+PRO76ffzmam/nhA+1zpAVeVcYGomQIaJqkCVpv7O1N3L/T3jwM63bVtQn59PZH4eCVB2AuUFKDl98Uqn3uPxf8f/8KqRV914NCIEAmcKjMBKBWgMgxCj8mhsJk39Tj+fz7BZLRsGITssu9C/s/qTf0Of/OP4l/8jnv7HcbjUzdppZ95Zm+ulrzqLolEFW5T4Z1oSP4B/l+gFuWgukV8SsXMe5CvkGglg0Aa2gK0QdkCGXsAOlYfPC1CAKayBrcErh0PAAmCHblaGYdgadFlhSVZegB5Q2ATyQA97DLoATVAtPTFoBVVwNN6bMdE5ZAm6YtjpWjjxT8r1HwVkpmoxacp2canc8eKR/8m/uvPk28uH7y1cTDioHXJNPXxG3kc+cw2d0ktgeoK7FVsX0/KLbBbNCkJjFJF2pNXlw5/HxePB391udn3f73a7z+36//xegDKGK4TOlNIwDEIa9Z3D9nt5+NAf/6NLxlByBS05C0iUrc2MUEBBwrtP32P06enoax1zcexjZcrrbcvE3/sTDc3FxW/j4XkCEDxxd0o20pvvwKwhC7ICIQY7sCNSOFcZPCSgDErgAOpAWxhX9AQY3EBHECEsgBZG0BHUglYwJjOGEJYO/QzQbkBcoVGzjjUQbmgHZNBLIBW2TR2WZa7MB3Tz+rpQ3/lm4BpBCUKWCy1NodkOR8mG7tydf6N78J3FW99Zbs68y2LTTE+x18Y9dMMr0q6RDnqj9C96mMWc2Mzq0NMswwrUOaklk+zG5v6hfzeu35XuTtN2i8Wi7/t/ItDbF5wA5RRch5nt9/vEHPF42PxAebk4/IrSCBXyHqzEDFcW5kTCs86HoWg/2Am9eRI3O722n8ZNXCtXCczaTRPutd0f+TTpb7vjxfM0ZROF88oORFRUIdRwk7dMBJjCZYSEanbpmDwx4ARsIAGOcGegDmGLnJCnshWGdvBHkEezQ3IwBR3hFnA7pIFAzozQMToAqNVUmdG6OQFm4B5chefQM1h7/eWZIZCJM2W4HqrgBC5d9DXiz7jWj2oQM1WDWko2RVNHuyfdkx+t3vv99aN3F5QEQ8YgFab/OvJkNoGGvY701LrYmvWtqJaBleMCZC3bX4uqGdm6sXl83PxwWjzhdtU2zWq1KvXP5xb9n3cCMHPBdUzTNAzD82nKD39q+wev8uXu6q/bfCFHYeXSiZISyawI4qWIqpOHZQMZBa4493m2XX9a7gaK7vRYm5oYWeJA/cr95Od33v3R+u473d/++eX+efrkeW577hYOTrXMKgSqJ+plaf8yeDAb1TnmVltjqGEi6lDUQJ0DG1wGGdghvwIxfAfpwYCbYB2MgRW4BRO0IewYCVQeNY9wD3BIF7AF0M4sggCMs03LAhDoq7lfkSKybdRYYQdYRKEdWwC7m1W6KlQxinolEpsGFdEoeOtHq92j7od/ut2et4u1p31EUouKZL9brEk//cbK9eB/VjLE7EUils0ENompWTRNatFsEI0kaC/O/uB4/tN07yfmWu/9+fn5er3+/1Hu4U1MgNN2rKwFQtNI7KzZpOXbafi1S+LlykSRyVzdSVX1tlObey0QNP+h3sBN0OmNptc3NQpkBTFla1teb8O9b/QXH+WmnV7mUdXGqOyobNKubRr0BMaepaSK5mDRK6loCIeCL64RMU9pC+AutNX6jbWu80iABCIiz2iBSPAgP4/sBUW3kwruzcOK2qiBGyBD/SyA2MI8DJAb4kdFXpIY7GaI08wdUlNFNhvNjMh1frP2997tzx63mztN17MHkAVpZnH+jun+LGd+c8V7Aj/fwFRYcXQUQMysgh0smxWZf1ok3qTFW9LfUdc3Tds0zYnt/jkH5BeQAM651WoVQsg5P32acjjHoz/mPE6H35xd/AVbhmQjD6v6g8TF2qHgM5XAYBgb2AgEndn0p8RgulYZOrVuYpYUWUkEC9/37rs/2+0etVefxL/5Xy8//uXx2a/GpiEimKckyEWhvuztA8M1aHoKYCICOycEJnbgri5u7QgIXJzlBVuA4ByaHSCQK0icFZAmWESzYjhvHRAcNeAVOEEFnGuy+QA0QAMtN2oEAtSBt0AEE7oNmKCgY2TJJklchBqigwvIAewKuaCIPeaMMSsEkvDw/W77sPnOf7X99u8vVzsPIwyCy8kGfd0xW3Bd62P2sj4lgJQ/mQt9K4g3g5hls2wQs8lMzKJiEItmE12tvhUXbx0e/Jcp7BThfLfr+361Wn1dEgBAUTbd7XYxxnEcry6Ae38YN+95uerTh218rs5IlcowyJFCOTgzgMxESUHEYJgZuU95bcxXLyoO/6YRUzYUNqZkeKHG3b3fnN9v7r7VfPT34we/HH/xZ6+uXqRnHw5u5YxIhYqvqzlC22K5gipsAkbAgz36FUID5+E9phaaYammn1jV9eQAMHCG9ggonIMqjLHYUoocE9QzN2g3QIImUDdvInqoAGNtuA2wI5zDcgPLMAMxXAN4pAlscEDqQYpGQAEuGCCCbJDJ9oe0z7rs3eZO88M/3f7eP99szsP9J31wiqh2lRG1CoPdhJzIZyAPp+iXebqZbwz+q9qwIZslNTHLplFNzCbDpGr9YfmN/cP/elo8OfJZ328Wy+Vut2vbtqAe8Lkfjy/inCASpScemlZkk6Bj/8QjhulAORKTOVe/vwyoggpnEMZ0zR073fR280/mXk1pJsPj9Z8rq2ucc1hs/O5BmyO9/Ghqlm6YZJgsJ4xRcyrYx7nTMDMqrpeoslvewzlwodwboLUcKk/WSajdO4iHCZwHG8DwjoTLa1bJiGXx5n2FXmSBM8DNOpKEPNWPaAQrYj0KyPziEZigVLi+IDO1nBAFY6NdoG7j7z5sz+43j97vzx42i5VrAspoci5XZnYRPlPhvIZoOFVEp8pnFj6bNbXNrFC9zDJMgKxKXXbbsX8S27u52bmma9q2jH0+B8jDm5gAp6GviFyojmj5yZ/a0z/HJ+Ni+sCqQwiZIyIGlJS4Rgwsl0kQmQMMxIpM1feuzkkNc1F93SiXH15SZFgmEoPnZusffqN78Nbi3jvtq2fx3//Zq//9f3553OenT+OR1XtoZ6YKTWYTHJNv1RJYmCYKSzhfpH6KAgOcQ+jgGxDBDNMRIHiG9TCDMZyHDyAjR+w9DEwK3aPrQB7UgsuQco92gWYJkbpKTm7OkABTDFMVrAoE5yCElECOnCtyLDnJ1Su7ShaO4/vfW73/49XPfr6786B957tLRwQxHKKNCjHEk8vTZyysZUZAyI1aX2v0W77GuiEDWqS0TbNpobdHtWjIitEGdza0710+/m/3zQMLy7NNPQXv+fVKgNN6uOg8ioiqjt4fDpLPfirNBh/+20YumuFgyvBlkejgoeWKFThfgOU2twQgN8+hy4VdIGRVLfH1WXb50dqohQdOnsnz2d2w3rmze/7RNxefPJ3+w19d/dmfX1y9sOfP4/GOIDhqmiKsw75lInKARpDCB3QtLIAJKtAJlkEeYYEUwQ6LFWKGCiSDpMDjiBzzClDigKZB2wGAClzJ6RahRdMijbXyDgEgUIZlELA7gwpSxH4PxwgeziFnHA/gXkD7I+6/iyc79/P/5uE731o8eXdx90EbArlRdBSIUZZrrZbXoGw6z48wR7/aTXx/pfYKrGhqJ9Oy/8o6E3wVySwZRhX1ozu7uP8nw/L9ffOgWWybrt/tdqvVarFYeP9FBuEX+bEBlC++OCyZ2Tgtcnd30mkMdzllLwOJMQyZjRXFg0Wt1iIKKvd9pbPQpywcr1djVjvjur65gXxQAwGjogGApucmuK7nmLE694dD/uVvBpCGA7gAo30V5SPvZ49RARFcAHmYwTmkaX4QyiLN4KxKthvBzWNzIjARO4CpdBHMMLu2JXIOnuEJUgobnXVdCowNCAECKKPovBVFSDZMxR6G+rXv3vLLB/atHy4fv93ffdB2nSeFjRlRcTKgttdIpzcG/K/RfPVGdXSj+LlBcSxOR2XaAyvvgHBGO4U7sX+SFo/UL5quLz/xUvx8wRH4xX74QhjYbrdmVuxWJ8eX1OS3/3V68X/Yy/+znz4yVoORKomRMZuRIwVXal+sWAQrUe6N5IYPMd3YHN+067kJo4iqSe2AfElwRAv3+O3m4VvNN3/Qf/ePw8VzGf7i7vsvF3YE7gQ0Ds7VS1ql3ruO4EKtvthQxI+YwRltBwPGPZyDKzA0AQTLO+Qy2xEQdgGLHiIwQ9cijVCtDh8m6AJEMA3wrvYJuRRXV3ABTYsmYBoxjiAgOGzW+Vlzvuv+zf/wYP2HubsbH+7OSAlih2dHZPgMb1Us7HqP+1l8fy175ne1JES+ljSEwbKa1poHSU2hURHNomoEoiLRyA/G/snzx//90L9tzXqxWOx2u8Visd1ui9Hv1zoBbvYDzrnNZrNnHsyiPjisv0PE/Oovve1DvLSyrS16umZUnN8MhUljtQUECcBW92Inj6tyW+fZ2NHmp4BvOnUaEpQsZ4sTkydq8PBRe77BeLXe/rLPe2+cZp1+rVZEpQn27lpSkBkhVMSSY4ivEc9l0u/mSWIiArkAcO2Ms8AM3oObuobwAd4jx+qGyQ7M8B7ZVR1HLXR7AjOahlICDM6ped80D99q/c5xR/uLRAkW1aKRmTeGt08hC2/uzHASrvr0TS81JeykFlSkHFIlE1iCqSGVASgw5Wx9cqvL3Y+n7uHYPqB21fbLzWZTNr5fYOP7ZiVAyYEyGF2v12YmIvt8Zuv3rVk3xw/D9NTFK4KSmBETzR4PJ1+lipUoxg9lOkd1McVWIc7XKiAn7T+CzrQXK9gYFUMcLTNRoLDizdbzwuV3envWxV8HR0dUjzsFEbyD5+KAV/eyYnAMuHkx58ARIEhxa2Gwr158OQGg0CBraSZgubbLRfdfpe7divhUeWqI4RtwgBkoIhZbLgMTgi//JoiEPHm/PfMTU0q6f5YQjRNaD0+wwo7nm1pwdG3VYv+ZOuda0aTgLKqRoJ0Qb9mgasksqk6GRNmtx/Bwv/v91N1N7Z1Ft+i6rnS9nzPe4U1PgAITKldCoY+Z2ch8wUv5xr9ujx/oR//LIv6Dl4GMTJU8sYGEyJMaQMTBwZQIJkwMsFnZhDpQdUqad8Z641ngGVtahcrMxHKy4SjJMBhZeyRzyxdxfUyrIOiKB5Oro8+mna0HZuaXRTDDOSCAGcGDtT4OzJWrUMI6RkpGsIp9ImC1BDs4j+EAU7iAHCEJzbK6HRWh/jTWD+oaNIBTKCErspgmUzW10Olg+p9+MR0+3ks4LDJaR32g0HnzXMcDNsNGXhdttnmP8SmAQ3kByp7LijKxmWZFgqlZMp0U2XSAJVXhQ/PN/fmPr3Y/3Ldvcej7vr9z585yuSzUqC+88nnjEuCEmu66DsA0Tc65wx6T3VG4i/N/ZpeujR938RMA8GwoBJZiO2oGJSMrPkEVEjFf7d6qh/XNVfEJIVlUQYr1Y5n4CYpLaZxkf5VMZHw1hSFvQuGozba6xVu09BaugaMK/yxPRNbaBvQdVDGlYuAK52sjqx6WyQhGVFKlfLqaK+a7NPeiCFyRp56gihThwuxw5ECnVTHQtlBFztx59fzqQo6SEXJoLbRk/lqNgUqRQ9XO5lqq/3THYwZyyqekzE94T8sKLQuvAvhRm7T8NmE9tvcud//ssHxnau/5dhnabrvdrtfrruvekMrnTUyA01AIQGEOqOplzjEEO/99zoNaCIdXDCER8s5MSYmYiVFnGVxBQmXMWPGUFYFjN/ZZN4xiTpTdE6a0eJmp5kmu9jFHjq/Gsyk7b1r8Zzzq4IWoruccVXst0grFkQlkcAbXQhRJwA6O0bSleYQ6UkdKMAfnEUI1oLQMUpDVqQ4xHNW+pfXIGaRgm20AyxI6FqoMuIMIIjgHM7+/1GNWNLo5UwvX5qt2ugL0tZkPrn2aXoN5Cqy0LrnKmVmsirYWC8DTbFIVs+yn5s6+//bl7kexOY+82vSLwok97bzerJDDG3ZOEtje+7Iej1O/v3J2/4+G8f34yXZz+e+a6QKauSE0jiyByRrWYo4XmJWMyZzAiARkhekLOAMROapVNRc95vLThRUp//mSIwErNCNFpMmZeQ4BOoI9tYvK61KpkxmZx+k5wxHYoW/hGC6g+Lm0rpb+mK6vWGLiAAgVG8fgAUAE4gEguEoOLpHnGNMEVTRNBcN5V8y1EcpqDLi6gGXSBBIzkZSKVwKT0TWwb65wymBXTmVPfROqOfv8fbCsVrD+GVDTYqWWrf55VJ3MRG3UnFy27vLsp4f1d4bNd674Ttstd8vVnTt3Sun/RYEdvmQJcKqFisR013VENE6TyCZanpbvTvGFxmahz1WEsygzXHFbMgLNSluFPQMjopsCE/ML8SnVmurBda2RSDVB6JpwVp14qXqO8iz46lzlXBX9Ee+qN2Xws+BXnl0/rMZ3KcWKaWNhqZxkiAovrESJc3AB3uBnVi/Plqj1S6BrUYwqK1+KJY+yXjA6mYRcW+IVNSzMUhA373vcYMAYbgg42436Ryviv/C8spmIZai45O9Etx37d2L3IDdbz33TdmXe/+bMfL4cCVB64oKaBjAMA4CLC8SmlQf3c3vWDB/wR/82TPuQo4mVVri4jpGymsCBrbilwqCofF0u5o/F6rauf6iChkoCEFBUcYunnGcSB3ZaPeyagBDgfa0MPND0cO4ab9fWWgSusEAy4jTnD2CGlCtWuWnIGbEhKhHAipRrLe492MG38AHa1epoGrBcAYY4IWeogefPWH21emxK+gVgQdI58d4TuxuGkKpEQJHJO0X2iTJm1yVQ2WRBioS/aQGUGhDVBCZq0SyrjYqoqm7S7uWdn42Lt4/nP53QKPnddrter9fr9WazKeYub2akvaEJUIASzLxarcrQwHs/DMNxf3W1/Da3j9Qtl/tfLPZ/28VnLqkZoM6cQkFK5KBO4QnGVT+FYaQAiHmWSKgqEqVjMANlnBYKZGAryqVwPhAHoIENkAnRihsrmKERYDQtRGGGPNX45gDn0PYFLQzvIQIY3KKinc0oT5wmaC5KdWhamCJPCAHOQVPtyjMBhLaHCojQLRGH+q/VRXiGJIjCN2ADZYyJ8uRMnRERO6v+ewQmYy4KDjcXAKfSX4qYy7wkzjAxU6voKa0gZ8tmk1g2SxjpwdTfvTz7g6vVd1PYCrqm65er1W63Wy6XxdXrzbz73/QEONVCRJRznqZJVYdhUNrAdYO+4+To0qU/7o0ix+yc1TkdF2h0qWDUhHEiopxUt2yGypXBzs36+MbqbNaGoFmsqtyaAnYgA3Ftgmm2PDP9lHJjGRaZgR1UAKqlEQiSyg7QiooWE9hBGZJq+1tpn1aLNEcQucaZlpKpwCtOH7oYH8zywuWzJnpNSdWq/vZ1BtgN64oZ3GYnBzudtWzNdPZxEdNkJiTSTIu7sXs8LN/L3X3zCxCHpum6brFYFH7jG1j3f2kSoNRCZTMQQlgul03TvHr1KkZ3Rd8c2/uX2x9tn/1v7fjhdv/vIYkdoSW0Zo4QwJnIk3qBA4TYMQhWRA4JxFx3BWoVZVN00lRJwFKijpnIGYhM+WS5pHBdbVtNZhCOAxjcoWnQNBgn5AnDJZY7ECFniMAUnVbMj0S0DbqOjkdyjLatYs5tUyv7RT+75yaoYjpArT47aYQK+mKYzZARYDiHlJAzhoP5BVzHaB2BVMHMKJRnrQJxZWN4ow0o+yybd8BajO3FyiOgyZAUYlZgDslyDtFtL89/enHvj3JzdnRnPgTn3N3z89VqVYqfLxDj+dVJgBNkqHiEFBbBNE0XFxdpsishPPh5k17li8erl3/VyL49XloyOKLO1BEHplCaV9PGwOACpicYS5FHLC4p9cqbAfaVAgmE0uhms6yAA3uwR87IhmlC38M38C3GIzTDgHHAcERoQR4BOFyBGG2HEGCKlMFcfSar8JHUeb8B5OAa5AjN8A3MoIpprPzPtgcBkuEDLIAaiEJihbWJIqYCIrJjhIzeJwUR8zUYXAwGdWCpSIhqTHQa/xerRrWKlsuFx2iW1CaFAEmSLSZe7R/8dAx3j9ufXNGKXdf1fZnzlHFn0TX5UoTWlyMBSksAoOu6lBIzj+MoIuZtcr34nuKL5vhbi4HjyMik6pisKXX/XBEVaLsxDDYb5ZHe4AloHcGfaIHXs5ayLLKT2pnNKkU0Ey+twitEoRlNDyKoQx7rgKiULloCnWsxdrKOv7ZYdBVtI7OScvm0y9S/Okpz7arVIFLbD5ttRkEwhWpxELi+gk9W9Drz5lDnPIYbq67yFEi16yqitgXYrGKWm+hXMdw/tG+n7v7U3TchzCZ25byBw/6vQgKcHDe89ymlpmn2+/3hcLi4uIi0Tmc/y4u3mvHp6vlfrI6/CNMl8sjRaesRhHxxoyZiUmcI1Zu3FD/Iokx2IhIX6TKxYBoAGJfhkUIRk2lEZAuOvMdyBckYBXlCu4DvEAe4Fr6Hb2GKOKBpwQ7cFKEEpLFiJYwhgizwAeSgXDEOna/MAT3UeS5xZbdLBDn4BpKgiuEIVaggpYrOcC0gyJM6UiL27IkYHFSdkBFV9XWvmOalsF5Dmk0VsUw8zaKZwNL8CAwpayvUXa2+P2y+fdx8+9A+MteI8e5s27ZtAfeHEBaLxZtf9nwpE+CUBqWvMrMCIzWznPM4DAe3HRqXz/+LHJYhfrKafuV18NNEGQhGgQ1mjqBMMBIyP8NFHajUGKUPFlBhPmoZhlIZ15vla9Gski4xw3FdJ00RBMQI5+ADcoQqRCECkkotN8UYEQp5YP6vYmADYlWRKLIOtUKf9V4K4i8rqPwvckPCjg1U229TqCBGEw9IMUAof+NaVK8Iv3D9WudFr1Uj7DzLNUeUih9Coj7x5ti/HcPuavPDobmX/Jn53vmw7LrNZtM0zWq1+jzl3L6+CVBWxUU9pvQDBTiUcz6mFdqlLh/msGymZ/wit/EpTS/gklMmUyqbgKAEhoOZws0sSqqz0DISYTWS4vRe2kVVTZKja7VWL2xQRZzQ9XUUEyNMESe0HZzHNBYpEuQMI2QBu9r7OoYBWUgzqSDlatRRtH30BKZQcJm0ppoJMQMn85oCYSCYqwqkWrbIGSlKdkLpZAlQUOJMBv8pUq+dUM0zJdKi2mzWa9l0MlOfuT+2jy62P566B8ft95I5USxC0zTNdrst4LblcvnGrrq+aglwmg4V4fUQQoyx67rLy8sY436/z/171D6Zlu/0h193+19u9v9Xk45NGmVidoaGtNGiF05N6XbNXHGHVAAkTGpsxorGmIwUQ5ZXY36+iGsyMzWzYKQQIRB8QNNBMszQL2GEKUGlbgBcOw9TGQY0S6jg6gqWqhapSMWWxqIjlFEmMMxAQtnbFRRd7RMcAoOAmBBHTBE+1FpoGCAK8VO+nPgF4RAKqd7AZmSgVBcg1y5sYjCzhNrpClkyTcZZ1dzEq6vN98f+7cP2+0d3lrmBha7r+r4vF/96vV6tVuUy+pIG0pc1AXDDlJuIRKQ0xymllBjaJAeSZJpCvtD0UvNFIwdVZdLCJnPejIiKoIhZdQ7FvB8VsMIZ5nFgVJ0gqxmWPDfJqiSCnGeSjV3jasDXTbTNJdbpjtRZuFlcHS4VQkyW2ijraStLYIc4N8oitStPGVkgCmcnyP5cu0W1kSw7M1dWxjoTR9VOIqql1TEFkmlhsWSBEIRHWovrhubecfFO7B/H5tzckjkUuG7f94vFommaz1nH8zYBXk8AAIvFwsyKk3iMcblcXlxcxBgPB0yrzXH9/rT9bnv4TXf41eblX3o5hDyQN3YmAZQUTOzMHINh3hmMoZzhFJTNF3lXTIqriAub7hTEtUWBI2qbWpGnXJvdMVbMT2hqfNeyWxDcbPDh4RzUitQuOMM5tEtgQBbEWWEnS53FFmT1SAg9UBzyGAAkIiusGL/Mwy4lUp9wkekFYfBqTomzMZSVquVHnReBimGRzrV+MgiLtZH6y7M/iN294+Z7Y/cgU5tzXnSLpmmKikff98vlstw++JIfjy//IaICNFfVojA8TdN+vz8ej8MwvOI7fnMWtj887r4X4ov+6m+X+1+E6SLEibyCYZ7h1TwZkhEpV+cgZ+aETAy4FPs4yW8M71hmJBhnCKBayeyl/a02vARiRIUp0gRTECN4xAg15AzNUEVooBNEETych41wAeQQ96BimwhwgOvgEkSRJjgCrI5HmcALuARNtj+YionY4WCZEFtpnkrzMbB3Jk7g2CgRyLRob6sJiNQQDaIqIKGkLvHysPnB2D+Oiyf7xftC7SgW0IQQzs7OCo9xvV6X/e6XaND51U+A07IMQBlIO+dEiiyljQCADDuGux4tFkI6NvETTRdej2wZmrmQnhwDZg7FvpsMrGAFLCmOQleWxRKBDY4rmoAcDHCEDJDO9qllIDMPedwNm9MTwh500yS9FlGlUqoiF75yI+vIhqtAUP07N7UtBKImZiomhGwS9oI9kEjhqMiNamEF1dGniKlZJlNv5hItU7OM4ey4eHdq70/hbvZrY++dtl3Xtu1isSiLyDLjf8PRDV/fBCiYuRCCiHRdN47j8Xi8uLgYx3Ecx0u+S929w+b3+s3vtePTxeUv1/u/8fnC5QuXsnNqgLKZs5OyvjM2NbKj0MvIH+cYfc4cI5oGji0EKOADka9yhUUSwld5kCrKXPHHvmYOMVhmEZR5/ywTMIIZXY/DHgZs1xV3ZAYj+AbTVIek3ACEnEwEIhZTmVeJFuyrTu5ZdB+RXjlZOHWV/1CWCgbLMKgpZXHi1tmtrtY/GBdPhtU3hv6dJJpzbsHBuSJc1XVdgbWdxm5fpePxlTtuPicwekmAw+GQcx7Hce92h35x7J4czr7v01V79XddfNpOz116CUuGiLIWY2MFmwVlzYeUPzzq3/TyoE1ngkyeCZ4aBwDjoYo+FAh0ShVu6TwcwxT7AW1f/wIFkMfxAJ2ASG5F5IAAE7CBpVLDXr2qq4MiBkFUHIxhBptghpyKWrAlWM4qSpMXHQ7ydzH9RulFYO/UGAJXLEcKEdIptRLOUrs8dm9Nq3dz2A7Nw4mCcEOGsspdLpcFfFWa3a7rvhTAntsEuG6OT0WqqpY5nZnFGHPOUXvlbnIOvnFhb5LBrVnTKkhG6AESFVasy8iMjMiSYp/seSNrwxlJcetQywozkoQwu+qVukRyxT54DzPkDK/g+RIGIc/NbhGKO61kc64JoDqLo1DlMevMwin+BRKLQphlWBLkZCmIxWjPVK9IRxYiUyOCsRqJMrgx8uTXU/Mwh82weGdcfEPCZgrnomZmwfu2bUuPG0IoqJ6yeMFX9Hxlv7DTyqzAh2KMi8UipbRerw+HQ3HoONhCqdvv7nqoR1oe/sHFV83V3zdXf8f5iOmKZCCzoBx1FP34iH/nc9vE+wplJkS18YIcwbfkWmKH1aIialIhgk3oChHMMI7XxKzipUeBiBEvUVTMS+97OFQXbwZCA19Ep4seRJw1LAimGidNUXPU3KhkSdn2++ie7Vd/JfiA9BDGUJUofJd9n8Iyrr8pzTauv3lYvivURjhRwKhlt+iaEvfl2SyKhYWOh6/08fiqnwIiKi+4iBR89TRNTdOMY5tzVlXJKarX5iG7XeM2zeKhy0d3eErTS+TBhhesE0HEvYr88Yhft8NdsKdGyRyZM/PQBI7YRyIPCrMhtSFKYRKiARjI0w09FsBydRLA3BlXIz2rSArMWDcYUi7yQVbwfImRGYlVxKJYTJN+NPFT8S/BntwKvEjdFr639ly7M+l2sXkorovhLPPC2HvftM4VVbJy8ZeCJ4TwOVi03ybA590fO+dUtSRASqnrusPhEGMchmEqxm3hnBqalm/39C2Ke3/1gTt8wOnK4TeaLoF99NHzc4dfh+OCXKcWHC9gwdSRTMaJssF18ARqK8Mgp3p/ewEIMVbzL2bSBMtoNyCC5dqqugaaag6UNFCpAyIRaIaM0OIe4i07iNcYLWadptF/NPlnKQzkenWNdOeyemztJi/ekuU9XdwdbGkgEWFix65pmjLbKRd/uftPAk34ehwyM3zNjpmp6jRN0zSJSEmDUhQV6tk4DDAjsuCYyZwMLr6k4Zld/dZdjM0ruff3b7e5b2nJqx2VbSiECOwdea5SXIVaX+Tcig0wKThACcpoOsjR8kDWAgYeYB3gQK4S7XXGAlEDyRj3EDVT00mtgZGp6jTINEqipIeIq2fv/iquNN1f0PoR2l3uHorrlFzKCpAaur4/rXK998WNvahvlHvh6xP3X68X4LNFUWHcM7Oqeu9jjDHGtm1LAhybRlWLaLuoigEe3LdwW14k2dlVknhh9PHgRnLaku+YisF3gpIxcVniwkEzQKAGrgER5AhjmEcc6kas8AyUqswvmnnen+qqmDIkYzqoOZiYDibJlERM4yGPexEaNnQ864f3fph7Sn1AWJnvzS3gGmbXBioE61NlX2aaZeDjnDuViF/DYPg6JsCpMSjDjWJUk1Jq21ZExnEsv52mqdBuoqo6B7ei7gEzi9ohfSDPjs1HnzRjstSgO3PkmAiaigAu+wA4Y0eYKv6nXYIY8QUQQIyUivneDFN2QIKdzDwUdgQ1oMZohGbIUXMLE9NRE5lSFtNpn+NVJD5uN/v3dsPbb0nwqkW7EARqnC8lftlhlZFOoa2Uof7Xqtq5TYDffUoclH1nKY1ijCJSnoWc8/F4LGC78tuk6enDs9B3w1Hu/f2H/fHAqUXDyuSSkDPySG5JJHDZUweC0US2L5KlhCKjkmAeaIE4fyJpxuZXMVOiBlhq+gA6qUbkwZQtUc5RVZEk52l0ePqd86sn2+HxmWNyRCXcy0Kw3PSnCqfc9ydpzq956N8mwOurg1IGFHipqpbaQERmkGkqxVKNHqX0YD19csGW3DT6ZMxQ58mYiaEJzDAyao0UPBmYyEGzFd0UiwBdC3ZWBdpiVpGtUBzJiARZTdUkqwqELQeLqpLVUgyY1ot0f407G7daFKfREynxdOWXuC9XfpkH3Ib+bQL87jQoCVBAjqpahqQppZxzSmkcx/IOHI/HvM3D2fqF4/43L+g/fNjG0QMunLNbwDfkJrCRY6GWSMx/AmpAzqExZ0YKuyRbwEAVlT+YTYCDLRWXZpnQwQbTpEKmLBpVEsRZXErOomn0V5f3t1ffejj++BvNol/Pw/syzylxX4r70t3eBv3tFOj/zbyoZEIZHJV3oCRAjPFwOOQXV/bJRfjFP67+9j+1l8fVlWdeOrdEGEBEvnG0AIG8giMBzGtY0VcZSs4xWkDNRqMEeLKd2oWZwDrTDEsq2Uwlj5bNlCw1Y+/iwr36/i6/fU/fuhfubtsZo19G+OWmL73+balz+wL8fy2NTnSnElKFkVwAp8edClvc79LzJUTaIXpJlKPpRExkzDSAGfAgAZnSBGOYgZKRFO9iqsK8GTBDNJsMAnXQ0WQUqKlaimLOjIVl7H3ahPhoi/tbOluV6D/BFr5Y19HbF+BrcUotdDgc9vt9WSDo00/ocr/467/rfnvZfXzVHY1AFAJ7EHmiJTgDAndJaIiaQqo3ErIN0MD6WYpWRD8xFZbHhkHtSuVKTSTltLqTlovDO3eHHzzRu2t+eF6kSNbrdVnlfh2QC7cvwBtxblIBS4U93bW8Wg7r1fTxy+PTl90/vnL7oX36qrlIDKXwjKgFOSIBDQQQnhA1pfqHRYIoLgCBtVBn5rJ+ZCpqedqQ9Ivx4Xl8/CRvFumde7RdujZ0y2WZ6Bf51K/nGus2Ab6YUypsVW3b1sxSStILNWFqgzFrcBBzF14PVzSBJDJFJmYoZTJLBvGkBBgZIc7K5HuDEBnQAiyclEldGJZOVn18cB4f7bBb2cNdmKeZTdOUiv9NsFu8LYG+jifGmFIahqGQDQ6Hg6ScYszThOPofvu0fXrk49E/f968HP1k/tJcjpxGjlYpZ9XgKIlP4l1qlrbaadPEO33eLGS7ifc3ul7oo7u+bb33vm3KpH+xWBS2Q9u2tz+I2xfgizk3NRFSSkQUY3TBpyZo24hZXI2Imd86Hw+JkrjJSIQ0Q42pTPuL8IMoqzGJC9T25pyuW21b9K2tF9w2Yb06LexOSJ6vEjf3NgG+rAlwKj/K7KUgLMZxFO9TCHJXVDWKnCaq/0/qq5sTp9MO6yaQwXu/WCxuV1q3JdCbcioBfxzL1mwYBhEpqIoTrq4sE2w+r/8k5lMSoORVAe0VOMMJ1/D1AevfvgBfnouEqFz/5dcl6G/+uiyVy2//cwlw8/ovy6zS7Ja4v0Vu3r4AX5pT/GyKaGmBVHz2EcC8aT5F/6nsObHYSkFV0uC22b1NgC9fXZRzNrPPRj8R3XwHTgnw2RLo9Krcfj9vS6AvX110UnJ/rfL57AtwCvFTGpy6gtvv5O0LcHtuzz/JuV0f3p7bBLg9t+c2AW7P7blNgNtze24T4PbcntsEuD235zYBbs/tuU2A23N7bhPg9tye2wS4Pbfnq3b+b0dhgo94RcNCAAAAAElFTkSuQmCC";
}