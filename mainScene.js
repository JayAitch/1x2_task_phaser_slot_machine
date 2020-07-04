gameConfig = {
    stakes:{
        max: 50,
        min: 5,
        current: 5
    },
    "stake-change-magnitude": 5,
    balance: 10000,
}





class MainScene extends Phaser.Scene {
    constructor() {
        super({key: 'MainScene'});
        this.stakes = gameConfig.stakes;
    }
    preload(){
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

    create() {

        // render all symbols, play animations test to display symbols
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

        // create stake controls pass stake object via reference
        let stakeControls = new StakeControls(this, this.stakes);

        // create balance display
        let balanceDisplay = new BalanceDisplay(this);

        // stubbed create spin button (display only currently)
        let playButton =  new Button(this,
            game.config.width - 100,
            game.config.height - 50,
            150,
            50,
            function(){console.log("SPIN BUTTON")},
            "SPIN!");
    }
    update(){

    }
}
class BalanceDisplay{
    constructor(scene) {
        let displayY = game.config.height - 100;
        // create current balance display
        this.balanceText = scene.add.text(
            100,
            displayY,
            gameConfig.balance,
        );
        this.balanceText.setOrigin(0.5);
    }

    showBalance(){
        // display remaining balance
        this.balanceText.setText(gameConfig.balance);
    }
}

class StakeControls{
    constructor(scene, stakes) {

        // store reference locally
        this.stakes = stakes;
        let controlY = game.config.height - 50;

        // create increase stakes button
        let plusButton =  new Button(scene,
            50,
            controlY,
            50,
            50,
            ()=>{this.changeStakes(+1)},
            "+");

        // create decrease stakes button
        let minusButton =  new Button(scene,
            150,controlY,
            50,
            50,
            ()=>{this.changeStakes(-1)},
            "-")

        // create current stakes display
        this.currentStakeText = scene.add.text(
            100,
            controlY,
            this.stakes.current,
        );
        this.currentStakeText.setOrigin(0.5);
    }

    changeStakes(sign){
        // calculate the amount to change the stakes
        let changeMagnitude = gameConfig["stake-change-magnitude"];
        let change = sign * changeMagnitude;

        // do the change to stakes
        this.stakes.current += change;

        // is the current value to low?
        if(this.stakes.current < this.stakes.min){
            // set it to the minimum
            this.stakes.current = this.stakes.min;
        }
        // is the current value to high?
        else if(this.stakes.current > this.stakes.max){
            // set it to the maximum
            this.stakes.current = this.stakes.max;
        }

        // change the display to reprisent the new stakes
        this.currentStakeText.setText(this.stakes.current);
    }
}


class Button{
    constructor(scene, x, y, width, height, action, text) {
        // shape to reprisent the touch area
        let rect = new Phaser.Geom.Rectangle(
            x - width / 2,
            y - height / 2 ,
            width,
            height
        );
        // add the graphics to the scene
        let graphics = scene.add.graphics({ fillStyle: { color: 0xffffff,alpha:0.3 } });

        // Zone to handle touch/click input
        this.clickZone = scene.add.zone(
            x, y, width, height
        );

        // textual element of button
        let buttonText = scene.add.text(
            x, y, text
        );
        // center the text
        buttonText.setOrigin(0.5);

        // enable interaction, add handler to trigger action
        this.clickZone.setInteractive().on('pointerdown', function(){
            action();
        })

        // display the visible touch area
        graphics.fillRectShape(rect);
    }

    setInteractive(val){
        // change interactability
        if(val){
            this.clickZone.setInteractive();
        }else{
            this.clickZone.disableInteractive();
        }
    }
}


