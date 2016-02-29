
// Wrap all of this in a IIFE to ensure no global variables 
(function() {

// Dev Param - start page
var startPage = 'p1'; 
var debug = false;
var currentPage = 'p1';

var hondurasLoc = '14.7478338,-87.3660537';
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');

});

var isAnimating = false;
var totalPages = 6;

window.onload = function() {

    console.log('window loaded');

    // Setup Forward and Back buttons
    document.getElementById('back').addEventListener('click', function() {
        if (!isAnimating && currentPage !== 'p1') {
            // hide current page
            fadeOut(document.getElementById(currentPage));
            currentPage = currentPage.slice(0,1) + (Number(currentPage.slice(-1))-1);
            console.log(currentPage);
        }
    });
    document.getElementById('forward').addEventListener('click', function() {
        if (!isAnimating && currentPage.slice(-1) < totalPages) {
            currentPage = currentPage.slice(0,1) + (Number(currentPage.slice(-1))+1);
            init[currentPage]();
            console.log(currentPage);
        }
    });

    // Load page 1
    document.getElementById('loading').style.display = 'none';
    //var page1 = document.getElementById('page1');
    //page1.style.display = 'block';

    // show start page
    //document.getElementById(startPage).style.display = 'block';
    init.startup();
    init[startPage]();
    
};


// Contains methods that trigger the start of each page
// Not sure if this is the best approach, but it seems
// that having an initialization for each page to kick
// off that page makes sense
// TODO: add a de-init method as well, to allow for 
// smoother backwards animation
var init = {
    startup: function() {
        // Set event listeners for spans
        for (var item in hoverContent) {
            var obj = hoverContent[item];
            var elt = document.getElementById(item);
            if (elt) {
                elt.hoverContentDir = obj.dir;
                elt.addEventListener('mouseover',displayHoverImg);
                elt.addEventListener('mouseout',hideHoverImg);
            }
        }
    },
    p1: function() {
        currentPage = 'p1';
        var page = document.getElementById(currentPage);
        page.style.display = 'block';
        fadeIn(page);
        setTimeout(function() {
            fadeIn(document.getElementById('p1Title'));
        }, 500);
        setTimeout(function() {
            fadeIn(document.getElementById('p1Segue'));
            document.getElementById('p1Segue').addEventListener('click', init.p2);
        }, 500);
    },

    p2: function() {
        currentPage = 'p2';
        var page = document.getElementById(currentPage);
        page.style.display = 'block';

        // Fade in
        fadeIn(page);
        setTimeout(function() {
            fadeIn(document.getElementById('p2Annotation'));
        }, 500);
    },

    p3: function() {
        currentPage = 'p3';
        var page = document.getElementById('p3');
        page.style.display = 'block';
        page.style.left = window.innerWidth + 'px';
        sweep(page,function() {
            setTimeout(function() {
                fadeIn(document.getElementById('p3Title'));
                fadeIn(document.getElementById('p3Para'));
            }, 500);
        }, {dir: 'in'});
    },
    
    p4: function() {
        currentPage = 'p4';
        var page = document.getElementById(currentPage);
        page.style.display = 'block';
        fadeIn(page);
    },
    p5: function() {
        currentPage = 'p5';
        var page = document.getElementById(currentPage);
        page.style.display = 'block';
        fadeIn(page);
    },
    p6: function() {
        currentPage = 'p6';
        var page = document.getElementById(currentPage);
        page.style.display = 'block';
        fadeIn(page);
    }
};

// Fired when span elements are hovered over
// Creates a container div, populates it with content,
// then pops it onto the screen
function displayHoverImg(options) {
    var container = document.createElement('div');
    container.id = 'hoverContainer';
    var eltId = event.target.id;
    var content = hoverContent[eltId];

    // Based on an image
    if (content.type === 'image') {
        var imgSrc = content.src;
        var img = document.createElement('img');
        img.src = imgSrc;
        container.appendChild(img);

        if (content.size) {
            img.style.width = content.size.x + 'px';
            img.style.height = content.size.y + 'px';
            img.style.marginLeft = (-content.size.x/2) + 'px'; 
            container.style.width = content.size.x + 'px';
        }

        if (content.desc !== '') {
            var p = document.createElement('p');
            p.innerHTML = content.desc;
            container.appendChild(p);
            if (content.size) {
                p.style.width = (content.size.x - 16) + 'px';
            } else {
                //p.stlye.width = '300px';
            }
        }

    }

    // Text only
    if (content.type === 'text' && content.desc !== '') {
        var textElt = document.createElement('p');
        textElt.innerHTML = content.desc;
        container.appendChild(textElt);
    }
    
    document.getElementById(currentPage).appendChild(container);

    // Set position
    console.log(content.dir);
    switch (content.dir) {
        case 'up-right':
            container.style.left = event.x + 'px';
            container.style.top = (event.y - container.offsetHeight) + 'px';
            break;
        case 'down-left':
            container.style.left = event.x - container.offsetWidth + 'px';
            container.style.top = (event.y + 50) + 'px';
            break;
        case 'up-left':
            container.style.left = event.x - container.offsetWidth + 'px';
            container.style.top = (event.y - container.offsetHeight) + 'px';
            break;
        case 'down-right':
            container.style.left = event.x + 'px';
            container.style.top = event.y + 'px';
            break;
    }
    fadeIn(container, null, {speed: 1});
    

}
// Destroys hover content when mouseout happens
var hideHoverImg = function() {
    if (!debug) {
        var content = document.getElementById('hoverContainer');
        content.parentNode.removeChild(content);
    }
}

var fadeIn = function(elt, callback, options) {
    isAnimating = true;
    var max = 1;
    var min = 0.5;
    var speed = 10;

    if (options) {
        for (var p in options) {
            console.log(p);
            switch (p) {
                case 'max':
                    max = options.max;
                    break;
                case 'min':
                    min = options.min; 
                    break;
                case 'speed':
                    speed = options.speed;
                    break; 
           }    
        }
    }

    var op = 0;  // initial opacity
    elt.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= max){
            clearInterval(timer);
            isAnimating = false;
            if (callback) callback();
        } else {
            op += 0.005;
            elt.style.opacity = op;
        }
    }, speed);
}

var fadeOut = function(elt, callback) {
    isAnimating = true;
    var op = 1;
    elt.style.display = 'block';
    var timer = setInterval(function() {
        if (op <= 0) {
            clearInterval(timer);
            isAnimating = false;
            elt.style.display = 'none';
            if (callback) callback();
        } else {
            op -= 0.005;
            elt.style.opacity = op;
        }
    }, 10);
}

var sweep = function(elt, callback, options) {
    isAnimating = true;
    var left = window.innerWidth;
    elt.style.left = left+'px';
    elt.style.opacity = 1;

    var timer = setInterval(function() {
        if (left <= 0) {
            elt.style.left = '0px';
            isAnimating = false;
            if (callback) callback();
            clearInterval(timer);
        } else {
            left -= 8;
            elt.style.left = left + 'px';
        }
    }, 10);
}

var isArrayLike = function(collection) {
    return collection.length == null ? false: true;
}
var forEach = function(collection, fn) {
    if (isArrayLike(collection)) {
        for (var index = 0; index < collection.length; index++) {
            collection[index] = fn(collection[index]);
        } 
    } else {
        for (var prop in collection) {
            collection[prop] = fn(collection[prop]);
        }
    }
    return collection;
}

// How to use my forEach() function
var arr = [0,1,2,3,4,5];
console.log(forEach(arr, function(item) {
    return item*4;  
}));

var obj = {one: 1, two: 2, three: 3, four: 4, five: 5};
console.log(forEach(obj, function(item) {
    return item*5;
}));

//console.log('object is of type: ' + isArrayLike({name: 'john', address: '111 main st.'}));
//console.log('array is of type: ' + isArrayLike(['john','jane','arnold']));
//console.log('array with length 0 is of type: ' + isArrayLike([]));
//console.log([].length);
//console.log([].length == null);


var hoverContent = {
    pod: {
        type: 'image',
        src: 'http://www.uq.edu.au/_School_Science_Lessons/55.4.JPG',
        desc: 'Ripe cocoa pod',
        dir: 'up-right'
    },
    openPod: {
        type: 'image',
        src: 'assets/images/openPod.jpg',
        desc: 'Open cocoa pod',
        dir: 'up-right'

    },
    discovery: {
        type: 'image',
        src: 'assets/images/ceramicFrag.jpg',
        desc: 'In 2006, archeologists discovered remains of ceramic pots in Honduras that showed chemical signs of cocoa dating as far back 1200 BC.  Even more recently, however, ceramic excavated from both the pacific and gulf regions of Mexico yielded results dating cocoa consumption back even farther, to 1900 BC, by the Mokaya and pre-Olmec peoples.',
        dir: 'up-right'
    },
    aztecs: {
        type: 'text',
        src: '',
        desc: 'The Aztecs believed that cocoa was a gift from the God of Wisdom, Quetzalcoatl. By the peak of the Aztec empire (ca. 1400) cocoa was imported from conquered areas and taxed',
        dir: 'up-right'
    },
    consumption: {
        type: 'image',
        src: 'assets/images/cocoaDrink.jpg',
        desc: 'Cocoa was traditionally consumed as a beverage. Fermented drinks were made from the white flesh of the cocoa pod, while the beans were often roasted and mixed with corn, water, and spices to make a <span style=\'color:white\'>frothy, bitter drink</span>. Some archeologists believe cocoa was consumed for it\'s nutrition, while other speculate that due to it\'s scarcity, it was highly valuable and only consumed by the elite and for ritual ceremonies.',
        dir: 'up-right'
    },
    conquistadors: {
        type: 'text',
        src: '',
        desc: 'By this point, ca. 1500 AD, people\'s of Central and North America had been cultivating cocoa for nearly 3500 years.',
        dir: 'down-left'
    },
    spain: {
        type:'text',
        src: '',
        desc: 'This Spanish mostly ignored cocoa, as the frothy bitter drink didn\'t cater to their tastes.  But once they began adding cane sugar, the drink quickly caught on with royalty and the elite. The Princess of Spain even presented cocoa beans to Louis XIV for their engagement.',
        dir: 'up-left'
    },
    wipedout: {
        type: 'text',
        src: '',
        desc: 'By this point the Spaniards had conquered much of Central and America and Mexico',
        dir:'up-left'
    },
    firstbar: {
        type: 'text',
        desc: 'It wasn\'t until 1847 that the first solid eating chocolate was produced. Up until then cocoa was still consumed as a beverage.',
        dir: 'down-left'
    },
    farming: {
        type: 'text',
        desc: 'Increasing demand pushed cocoa farming around the world. While it originated in Central America, farmers from Martinique, Guadalupe, Jamaica, Hispaniola and Trinidad became vital to the supply of cocoa.',
        dir: 'down-left'
    },
    expansion: {
        type: 'text',
        desc: 'Technological advances, like steam and hydraulic powered grinding machines, made mass cocoa processing possible, stressing the supply coming from around the world.',
        dir: 'down-left'
    },
    africaproduction: {
        type: 'image',
        src: 'assets/images/africaproduction.png',
        desc: 'While native to the Americas, most cocoa today comes from Africa.  Cot&ecirc d\'Ivoire being the largest exporter.',
        dir: 'up-left',
        size: {
            x: 400,
            y: 400,
        }

    },
    productionchart: {
        type: 'image',
        src: 'assets/images/worldwidecocoa.png',
        desc: 'Cocoa production has more than doubled since 1980, averaging over 4,000,000 tons in 2014/2015',
        dir: 'down-left',
        size: {
            x: 550,
            y: 300,
        }
    },
    tech: {
        type: 'text',
        desc: 'Most technological advances have increased the efficiency of processing - i.e. drying and grinding - rather than farming.',
        dir: 'up-right',
    },
    smash: {
        type: 'image',
        src: 'assets/images/smash.jpg',
        desc: 'A farmer cracking pods',
        dir: 'up-right',
    },
    bananaleaves: {
        type: 'image',
        src: 'assets/images/fermenting.jpg',
        desc: 'Cocoa beans fermenting inside banana leaves',
        dir: 'up-right',
    },
    elnino: {
        type: 'text',
        desc: 'The 1997-98 El Nino wiped out large swaths of cocoa trees throughout Ecuador. This prompted many farmers to switch to CCN-51.',
        dir: 'down-right',
    },
    ccn51: {
        type: 'text',
        desc: 'Only one problem, CCN-51 didn\'t taste very good. In fact, people compared the taste to acid, or dirt. Luckily for chocolate manufacturers, with enough added fat and sugar, consumers didn\'t even really notice the difference.',
        dir: 'up-left',
    },
    pests: {
        type: 'text',
        desc: 'If left unchecked, mirids and a moth like insect called Cocoa Pod Borers can reduce yields from trees up to 75%',
        dir: 'down-right',
    },
    diseases: {
        type: 'image',
        src: 'assets/images/witchesbroom.jpg',
        desc: 'A common fungus called Witches Broom reduced yields in Brazil by 70% over a period of 10 years',
        dir: 'down-right',
        size: {
            x: 200,
            y: 200
        }
    },
    childlabor: {
        type: 'text',
        desc: 'Estimates suggest approximately 1.8 million children in the Ivory Coast and Ghana are exposed to child labor.',
        dir: 'down-right',
    },
    hersheys: {
        type: 'text',
        desc: 'Hershey\'s in particular',
        dir: 'up-left',
    }
};

}());
