//Roulette Framework for Bitsler.com
//  There are many unused functions but feel free to add more betting strategies
//  that make use of them :)

// open to see even and odd also: by default only red, green, black display
$("#btn-more").click();

//close the chat window, under 3 seconds risks not working, my guess is that
//a plugin starts before the chat window open, after it thinks that
//bitsler has fully loaded
setTimeout(function () {
  $("#close-chat").click();
}, 3000);

//total amount users have bet on options
function redTotal(){return parseFloat($("#redbet-total").text());}
function blackTotal(){return parseFloat($("#blackbet-total").text());}
function evenTotal(){return parseFloat($("#evenbet-total").text());}
function oddTotal(){return parseFloat($("#oddbet-total").text());}
function greenTotal(){return parseFloat($("#greenbet-total").text());}

//what the casino pays out on wins
function redPayout(){return redTotal()*2.05}
function blackPayout(){return blackTotal()*2.05}
function oddPayout(){return oddTotal()*2.05}
function evenPayout(){return evenTotal()*2.05}
function greenPayout(){return greenTotal()*14.35}

//user's remaining balance as a float
function getBalance(){return parseFloat($(".balance-btc-html").text());}

//set the bet to a specific number
function setBet(b){$("#bet-amount").val(String(b))}

//clear all the bets placed this round
//(maybe something changed the last second and you don't want to risk it)
function clearBet(){$("#btn-clear").click();}

//place bets on specific options
function betGreen(b){
  setBet(b);
  $("#btn-bet-green").click();
}
function betBlack(b){
  setBet(b);
  $("#btn-bet-black").click();
}
function betRed(b){
  setBet(b);
  $("#btn-bet-red").click();
}
function betEven(b){
  setBet(b);
  $("#btn-bet-even").click();
}
function betOdd(b){
  setBet(b);
  $("#btn-bet-odd").click();
}

//does one option hold over 50% of the payout?
function mostRed(){
  if(redPayout() > blackPayout()+greenPayout()+oddPayout()+evenPayout()) return true;
  else return false;
}
function mostBlack(){
  if(blackPayout() > redPayout()+greenPayout()+oddPayout()+evenPayout()) return true;
  else return false;
}
function mostEven(){
  if(evenPayout() > redPayout()+greenPayout()+oddPayout()+blackPayout()) return true;
  else return false;
}
function mostOdd(){
  if(oddPayout() > redPayout()+greenPayout()+evenPayout()+blackPayout()) return true;
  else return false;
}

//is Red > Black? Black > Red? Even > Odd? Odd > Even?
function redOverBlack(){
  if(redTotal()>blackTotal())return true;
  else return false;
}
function blackOverRed(){
  if(redTotal()<blackTotal())return true;
  else return false;
}
function evenOverOdd(){
  if(evenTotal()>oddTotal())return true;
  else return false;
}
function oddOverEven(){
  if(evenTotal()<oddTotal())return true;
  else return false;
}

//a red/black, black/red, even/odd, odd/even ratio returned
function rbRatio(){
  return redTotal()/blackTotal();
}
function brRatio(){
  return blackTotal()/redTotal();
}
function eoRatio(){
  return evenTotal()/oddTotal();
}
function oeRatio(){
  return oddTotal()/evenTotal();
}


//progressive martingale, ie: min bet is earned on average each round
//the "turn" should be increased by 1 on every loss and reset to 1 on every win
//profit is always = turn * minbet, above all losses in the turn sequence
//WARNING: huge risk with martingale strategies
//should set minbet to 0.0000001 and have at least 0.01 BTC to risk for loss
//when it works, this would glean 12,000 satoshi per hour,
//about 0.45 usd if 1 Bitcoin is worth 3772.31
//not used in sample strategies below but i did earn around 80 USD with it
//over 500 USD before bitsler changed its algorithm to shake me down i assume
function setNewBet(turn,min){
  $("#bet-amount").val(String((Math.pow(2.0,turn)-1.0)*min));
}

//can use this to determine "did i win or lose the last round?"
lastBalance = getBalance();

//minimum bet is 1000 satoshi, bitsler allows a minimum bet of 100 satoshi
//so you can add an extra 0 before the 1
//1 satoshi = 0.00000001 Bitcoin
minbet = 0.00001;
setBet(minbet);

//For bet increases, use "minbet" as the base, and modify Bet for increases
Bet = minbet;

//for the bet_AgainstHerd() strategies
placedEO = true; //placed at 3 seconds left
placedRB = true; //placed at 2 seconds left
placedG = true;  //placed at 1 seconds left

//////// STRATEGIES ////////

function betGreenAgainstHerd()
{
  if ($("#status").text() != "PREPARING TO SPIN IN 1 SEC")
  {
    placedG = false;
  }
  if ($("#status").text() == "PREPARING TO SPIN IN 1 SEC")
  {
    if(placedG == false)
    {
      R = redPayout();    r = R/2.05;
      B = blackPayout();  b = B/2.05;
      E = evenPayout();   e = E/2.05;
      O = oddPayout();    o = O/2.05;
      G = greenPayout();  g = G/14.05;
      console.log('You are being Audited: '+r+', '+b+', '+e+', '+o+', '+g);

      if(r+b+e+o+g > 0.01)
      {
        if(r+b+e+o > G*2+minbet*14.35){
          betGreen(minbet);
        }
      }
      placedG = true;
    }
  }
}

function betRedBlackAgainstHerd()
{
  if ($("#status").text() != "PREPARING TO SPIN IN 2 SEC")
  {
    placedRB = false;
  }
  if ($("#status").text() == "PREPARING TO SPIN IN 2 SEC")
  {
    if(placedRB == false)
    {
      r = redTotal();
      b = blackTotal();
      if(r+b > 0.01)
      {
        if(r > b*3+minbet){
          betBlack(minbet);
        }
        if(b > r*3+minbet){
          betRed(minbet);
        }
      }
      placedRB = true;
    }
  }
}

function betEvenOddAgainstHerd()
{
  if ($("#status").text() != "PREPARING TO SPIN IN 3 SEC")
  {
    placedEO = false;
  }
  if ($("#status").text() == "PREPARING TO SPIN IN 3 SEC")
  {
    if(placedEO == false)
    {
      e = evenTotal();
      o = oddTotal();

      if(e+o > 0.01)
      {
        if(e > o*3+minbet){
          betOdd(minbet);
        }
        if(o > e*3+minbet){
          betEven(minbet);
        }
      }
    }
      placedEO = true;
  }

}

setInterval(betEvenOddAgainstHerd,500);

setInterval(betRedBlackAgainstHerd,500);

setInterval(betGreenAgainstHerd,500);
