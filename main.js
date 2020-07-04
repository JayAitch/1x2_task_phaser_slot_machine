//Dummy JSON responses
let data = [

    {
        "response": {
            "results": {
                "win": 0,
                "symbolIDs": []
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 8,
                "symbolIDs": [5, 4, 0]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 1,
                "symbolIDs": [0]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 0,
                "symbolIDs": []
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 2,
                "symbolIDs": [1, 0]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 4,
                "symbolIDs": [2, 1, 0]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 4,
                "symbolIDs": [5]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 3,
                "symbolIDs": [2, 0]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 0,
                "symbolIDs": []
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 8,
                "symbolIDs": [5, 4, 1]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 9,
                "symbolIDs": [5, 3, 2, 1]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 6,
                "symbolIDs": [4, 0, 1]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 1,
                "symbolIDs": [1]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 5,
                "symbolIDs": [1, 2, 3]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 0,
                "symbolIDs": []
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 5,
                "symbolIDs": [0, 2, 3]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 0,
                "symbolIDs": []
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 6,
                "symbolIDs": [0, 2, 3]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 8,
                "symbolIDs": [0, 1, 2, 5]
            }
        }
    },

    {
        "response": {
            "results": {
                "win": 0,
                "symbolIDs": []
            }
        }
    },

]

let config  = {
    type: Phaser.WEBGL,
    width: 1280,
    height: 720,
    scene: {
        pack: {
            files: [
                {
                    type: 'scenePlugin',
                    key: 'SpinePlugin',
                    url: 'SpineWebGLPlugin.min.js',
                    sceneKey: 'spine'
                }
            ]
        },
        preload:preload,
        create: create,
        update:update
    }
}

let game

window.addEventListener('load', function() {
    game = new Phaser.Game(config)
})

function preload(){
    // localise file location to symbols folder
    this.load.setPath('./assets/symbols/')
    // cache spines
    this.load.spine('cherry', 'symbol_00.json',['symbol_00.atlas'], true);
    this.load.spine('lemon', 'symbol_01.json',['symbol_01.atlas'], true);
    this.load.spine('orange', 'symbol_02.json',['symbol_02.atlas'], true);
    this.load.spine('plumb', 'symbol_03.json',['symbol_03.atlas'], true);
    this.load.spine('grapes', 'symbol_04.json',['symbol_04.atlas'], true);
    this.load.spine('melon', 'symbol_05.json',['symbol_05.atlas'], true);
}

function create() {

     // render all symbols, play animations
    let cherry = this.add.spine(100, 400, 'cherry');
    cherry.play("win", true);

    let lemon = this.add.spine(200, 400, 'lemon');
    lemon.play("win", true);

    let orange = this.add.spine(300, 400, 'orange');
    orange.play("win", true);

    let plumb = this.add.spine(400, 400, 'plumb');
    plumb.play("win", true);

    let grapes = this.add.spine(500, 400, 'grapes');
    grapes.play("win", true);

    let melon = this.add.spine(600, 400, 'melon');
    melon.play("win", true);

}
function update(){

}