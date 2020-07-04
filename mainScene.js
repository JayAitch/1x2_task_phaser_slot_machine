const gameConfig = {
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
        let cherry = this.add.spine(400, 400, 'cherry');
        let lemon = this.add.spine(500, 400, 'lemon');
        let orange = this.add.spine(600, 400, 'orange');
        let plumb = this.add.spine(700, 400, 'plumb');
        let grapes = this.add.spine(800, 400, 'grapes');
        let melon = this.add.spine(900, 400, 'melon');

        // reference the symbols in map
        this.slotWheelMap = {
            0: cherry,
            1: lemon,
            2: orange,
            3: plumb,
            4: grapes,
            5: melon
        }

        // create stake controls pass stake object via reference
        let stakeControls = new StakeControls(this, this.stakes);

        // create balance display
        this.balanceDisplay = new BalanceDisplay(this);

        // create the spin button, handle action via the scene
        this.spinButton =  new Button(this,
            game.config.width - 100,
            game.config.height - 50,
            150,
            50,
            ()=> {this.performSpinAction()},
            "SPIN!");
    }


    performSpinAction(){
        this.spinButton.setInteractive(false);

        let spinPromise = new Promise(
            (resolution, rejection)=>{
                this.simulateSpin(resolution, rejection);
            }
        ).catch(
            error =>{
                this.spinErrorDisplay(error);
            })

        spinPromise.then(()=>{
            this.spinButton.setInteractive(true);
        })
    }

    spinErrorDisplay(val){
        // feedback spin attempt error to UI
        let errorText = new FadingText(this, val,game.config.width - 100,game.config.height - 100);
    }

    balanceMessageDisplay(val){
        // show gaining or loosing money
        let sign = val? "+": "";
        let balanceMessage = new FadingText(this, sign + val,100,game.config.height - 140);
    }

    simulateSpin(resolution, rejection){

        // make sure the bet is affordable
        if(this.canAffordBet()){

            // simulate reduction in balance
            this.removeBalance();

            // simulate API call for result
            let rollResult = getRandomRoll();

            // safely access the response of the roll
            if(rollResult.hasOwnProperty("response")){
                let response = rollResult.response;

                // safely access the result of the response
                if(response.hasOwnProperty("results")) {
                    let result = response.results;

                    // is there a win property thats above 0
                    if(result.win && result.win > 0){

                        // perform win procedure
                        this.rewardPlay(result);
                    }
                    // resolve the promise
                    resolution("done");
                }
                else{
                    // malformed response
                    rejection("bad response");
                }
            }
            else{
                // malformed response
                rejection("bad response");
            }
        }
        else{
            // not enough money to bet
            rejection("not enough funds");
        }
    }

    removeBalance(){
        // deduct the balance
        gameConfig.balance -= this.stakes.current;
        // display deduction
        this.balanceDisplay.showBalance();
    }

    rewardPlay(result){
        // add the win amount to the current balance
        gameConfig.balance += result.win;
        // display any changes
        this.balanceDisplay.showBalance();
        // animate the winning symbols
        this.showWinAnimations(result.symbolIDs);
        this.balanceMessageDisplay(result.win);
    }

    showWinAnimations(ids){
        // go through the winning ids
        ids.forEach((id)=>{
            // find in the map
            let symbol = this.slotWheelMap[id];
            // play the win animation
            symbol.play("win");
        })
    }



    canAffordBet(){
        if(gameConfig.balance >= this.stakes.current){
            return true;
        }else{
            return false;
        }
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


class FadingText{
    constructor(scene, text, x, y) {
        // show the message and hide it gradually
        let fadingText = scene.add.text(x,y,text);
        fadingText.setOrigin(0.5);

        scene.add.tween({
            targets:fadingText,
            alpha: {from:1, to:0},
            ease: 'Linear',
            duration: 1000,
            delay:0
        })

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

        // is the current value too low?
        if(this.stakes.current < this.stakes.min){
            // set it to the minimum
            this.stakes.current = this.stakes.min;
        }
        // is the current value too high?
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


