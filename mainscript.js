// Write JavaScript here
var start = [
  7,0,0,  6,9,0,  3,5,2,
  0,5,0,  0,1,4,  9,0,0,
  8,0,0,  0,3,0,  1,0,4,
  
  0,0,2,  0,7,0,  8,0,0,
  3,8,0,  5,6,1,  2,7,0,
  0,7,5,  9,0,0,  0,3,0,
  
  0,0,0,  0,4,0,  6,0,1,
  0,1,0,  8,0,0,  0,4,0,
  0,0,0,  0,2,6,  0,9,8
];

var cell = new Array(81),
    rw = new Array(9),
    co = new Array(9),
    sq = new Array(9),
    line = new Array(18);
	set = new Array(17);

var selected = null;

init(start);
update(cell);

// Handler
$(".sq").click(function(e){
  var x = $(e.target);
  
  if(selected){
    selected.removeClass("selected");
  }
  
  if( !x.hasClass("fixed") ){
    x.addClass("selected");
    selected = x;
  }else{
    selected = null;
  }
});

$(document).on("keydown", function(e){
  //48 - 57
  var i = selected.data("i");
  var n = e.which - 48;
  
  if(n == -40){
    cell[i].num = 0;
  }
  
  if(selected && n > 0 && n < 10){
    cell[i].num = n;
  }
  
  update(cell);
});

function check(setgrp, func){
  $.each(setgrp, function(i,s){
    func(s);
  });
}

function isComplete(lst){
  var a = [false,false,false,false,false,false,false,false,false];
  for(var i=0 ; i<9 ; i++){
    var n = lst[i].num;
    if(n > 0){
      a[n-1] = true;
    }else{
      return false;
    }
  }
  return a.every(function(elem){return elem;});
}

function completeOneMissing(lst){
  var el = null;
  var a =[1,2,3,4,5,6,7,8,9];
  
  for(var i=0 ; i<9 ; i++){
    var n = lst[i].num;
    if(n === 0){
      el = lst[i];
    }
    
    var ind = a.indexOf(n);
    if(ind > -1){
      a.splice(ind, 1);
    }
  }
  
  //console.log(a);
  if(a.length == 1){
    el.num = a[0];
    check(set, completeOneMissing);
  }
}

function highlight(lst){
  
  if(selected){
    selected.removeClass("selected");
    selected = null;
  }
  
  $.each(lst, function(i,v){
    v.high = true;
  });
}

function init(st){
  
  for(var i=0; i<9; i++){
    rw[i]= new Array(9);
    co[i]= new Array(9);
    sq[i]= new Array(9);
  }
  
  var sqs = $(".sq");
  
  for(var i=0; i<81 ; i++){
    
    var c = {
      num:st[i],
      fixed: st[i]>0,
      high: false,
      ref:$(sqs[i])
    };
    
    cell[i] = c;
    
    var m = Math.floor(i/9);
    var n = i % 9;
    
    var a = Math.floor(m/3), b = Math.floor(n/3),
        e = m % 3, f = n % 3,
        s = 3*a + b, j = 3*e + f;
    
    rw[m][n] = c;
    co[n][m] = c;
    sq[s][j] = c;
  }
  
  line = rw.concat(co);
  set = line.concat(sq);
  
}

function update(so){
  
  for(var i=0; i<81 ; i++){
    so[i].high = false;
  }
  
  check(set, completeOneMissing);
  
  check(set,function(s){
    if(isComplete(s)){
      highlight(s);
    }
  });
  
  render(so);
}

function render(so){
  $.each(so, function(i,c){
    
    if(c.fixed){
      c.ref.addClass("fixed");
    }else{
      c.ref.removeClass("fixed");
    }
    
    if(c.high){
      c.ref.addClass("highlight");
    }else{
      c.ref.removeClass("highlight");
    }
    
    if(c.fixed && c.high){
      c.ref.addClass("fixed-high");
    }else{
      c.ref.removeClass("fixed-high");
    }
    
    if(c.num > 0){
      c.ref.html(c.num);
    }else{
      c.ref.html("");
    }
    
  });
}

