
//const psychoJS = new PsychoJS({
  //debug: true
//})

var ntrials = 14;
//index for array tracking
var index=0;
//total score
var totalscore=0;
//dummy for trial length
var triallength = new Array(ntrials);
//chosen deck
var chosendeck = new Array(ntrials);
//generated sun tracker
var sunseen = new Array(ntrials);
//generated rain tracker
var rainseen = new Array(ntrials);
//generated temperature tracker
var tempseen = new Array(ntrials);
//received reward tracker
var reward = new Array(ntrials);
//pre-initialize sun, temp, and rain for presentation
var firstgen=generate();
var sun1=firstgen[0];
var temp1 =firstgen[1];
var rain1=firstgen[2];
//k is a dummy to track whether Uranio or context s currently shown
var k=0;
//chosen deck
var chosen=0;
//producend outcome
var deckproduce=0;


////////////////////////////////////////////////////////////////////////
//CREATE HELPER FUNCTIONS
////////////////////////////////////////////////////////////////////////
//hides page hide and shows page show
function clickStart(hide, show)
{
        document.getElementById(hide).style.display ='none' ;
        document.getElementById(show).style.display ='block';
        window.scrollTo(0,0);
}

//changes inner HTML of div with ID=x to y
function change (x,y){
    document.getElementById(x).innerHTML=y;
}

//Hides div with id=x
function hide(x){
  document.getElementById(x).style.display='none';
}

//shows div with id=x
function show(x){
  document.getElementById(x).style.display='block';
}

//sets a value at the end to hidden id
function setvalue(x,y){
  document.getElementById(x).value = y;
}

//my normal
var spareRandom = null;

function normalRandom()
{
	var val, u, v, s, mul;

	if(spareRandom !== null)
	{
		val = spareRandom;
		spareRandom = null;
	}
	else
	{
		do
		{
			u = Math.random()*2-1;
			v = Math.random()*2-1;

			s = u*u+v*v;
		} while(s === 0 || s >= 1);

		mul = Math.sqrt(-2 * Math.log(s) / s);

		val = u * mul;
		spareRandom = v * mul;
	}

	return val;
}

function normalRandomScaled(mean, stddev)
{
	var r = normalRandom();

	r = r * stddev + mean;

	return Math.round(r);
}

//Function to randomly shuffle an array and get first element
function generate(){
    var x1=Math.random() >0.5?1:-1;
    var x2=Math.random()>0.5?1:-1;
    var x3=Math.random()>0.5?1:-1;
    return [x1,x2,x3]
};

//translate from {1,-1} to {+,-}
function translate(x){
  var y="-";
  if(x==1){
    y="+"
  }
  else if(x==-1){
    y="-"
  };
 return(y)
}

hide('submitButton');
////////////////////////////////////////////////////////////////////////
//CREATE EXPERIMENTAL FUNCTIONS
////////////////////////////////////////////////////////////////////////
//deck output generation

function deck(mercury,krypton,nobelium,numb) {
 if (numb===1){

//deck1: likes first, dislikes second, indifferent to last, plus noise
    var out=Math.round(50+15*mercury-15*krypton+normalRandomScaled(0,70))
  } else if(numb===2){
//deck2: dislikes first, indifferent to second, likes last, plus noise
    var out=Math.round(50+15*krypton-15*nobelium+normalRandomScaled(0,100))
  } else if(numb===3){
//deck3: indifferent to first, likes to second, dislikes last, plus noise
    var out=Math.round(50+15*nobelium-15*mercury+normalRandomScaled(0,300))
  } else{
    var out=Math.round(normalRandomScaled(50,1))
  }
  //Show turned on
 k=k+1;
 //return output
 return(out)
};


function showdeck(n){
  //check k
   if (k===0){
   //track chosen deck
   chosen=n;
   //produce output
  deckproduce=deck(mercury=sun1,krypton=temp1,nobelium=rain1, numb=n);

   //show output on planet
   var whichdeck='deck'+n;
   change(whichdeck,deckproduce);
   //hide context
   ['sun','rain','temp'].forEach(hide);
   //hide planetas
   ['deck1','deck2','deck3','deck4'].forEach(hide);
   //show next button
   show('next');

  //feedback
  //si es Uranio
  if (deckproduce>0){
    var present='Conseguiste '+deckproduce+' rocas de Uranio.'
  }
  else if (deckproduce==0) {
    var present='Hoy no conseguiste Uranio.'

  }
  else {
    var present='¡Oops! Elemento incorrecto, eso es Plutonio. Ahora tienes menos '+deckproduce+ ' rocas.'
  }

  change("outcome",present);
  return(chosen,deckproduce);

 }
}

//overal trial function
function mynexttrial(){
    if (triallength.length > 0) {
        //track trial number
        triallength.shift();
        //track produced output
        sunseen[index]=sun1;rainseen[index]=rain1;tempseen[index]=temp1;
        chosendeck[index]=chosen;
        reward[index]=deckproduce;
        //generate new output
        var gen=generate();
        sun1=gen[0];
        temp1 =gen[1];
        rain1=gen[2];
        
        

        //reset show dummy
        k=0;
        //reset button description
        change('deck1','PLANET 1');change('deck2','PLANET 2');
        change('deck3','PLANET 3');change('deck4','PLANET 4');
        //show new context
        var insertsun = 'MERCURIO '   +translate(sun1);
        var insertrain ='KRYPTON  '   +translate(temp1);
        var inserttemp ='NOBELIO  '   +translate(rain1);
        //insert new context
        change('sun',insertsun);change('rain', insertrain);change('temp',inserttemp);
        ['sun','rain','temp'].forEach(show);
        ['deck1','deck2','deck3','deck4'].forEach(show);
        //hide next button
        hide('next');
        //keep track for index used to assign array content
        index=index+1;
        //show remaining number of trials
        var insert ='Días restantes: '+(ntrials-index+1);
        change("remain",insert);
        //show total score
        totalscore =totalscore+deckproduce;
        if (totalscore<0){
            totalscore=0
        }
        else if(totalscore==0){
            totalscore=totalscore
        }
        var insertscore ='Uranio total: '+totalscore;
        change('score',insertscore);
        //Last trial:
        if((ntrials-index)===0){
            //show "Ir al espacio page button"
            change('nexttrial','Ir al espacio');
            //Show info that trials are done
            change('finaltext','Ha terminado la fase de entrenamiento, es hora de ir al espacio.'); ////////separar este mensaje del ultimo reward
        }
    }
    else {
        //go to next page
        //clickStart('page8','page9'); para decir que el entrenamiento acabó
        clickStart('page9','page10');
    }
}

//Final submit function
function mysubmit(){
    //caculate number of mined emeralds overall
 var presenttotal='Conseguiste '+totalscore+' rocas de Uranio.';


 clickStart('page9','page10');
}


 //save all created values
function mysubmit(){
   //claculate numbeer of mined emeralds overall
  var presenttotal='Conseguiste '+totalscore+' rocas de Uranio.';
 //save all created values
 setvalue('sunseen',sunseen); setvalue('rainseen',rainseen); setvalue('tempseen',tempseen);
 setvalue('chosendeck',chosendeck); setvalue('reward', reward); setvalue('total', totalscore);
 //Go to final "Thank you"-page

 clickStart('page5','page6');
}
