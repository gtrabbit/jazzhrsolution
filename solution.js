// Makes a class-based system

class Feature {
	constructor(name, ...props){
		this.name = name;
		this.props = props || null;
	}
}

class FeatureGroup {
	constructor(name, weight, ...features){
		this.name = name;
		this.weight = weight;
		this.features = {}
		for (let feature of features){
			this.features[feature.name] = feature;
		}
	}
}


class GroupAllocation {
	constructor(name, customers, ...groups){
		this.name = name;
		this.groups = {};
		this.customers = customers
		for (let group of groups){
			this.groups[group.name] = group;
		}
		this.distributeWeights(this.calcTotalWeight());

	}

	distributeWeights(totalWeight){
		let p = 0;
		console.log(totalWeight)
		for (let group in this.groups){
			this.groups[group].min = p;
			let chance = this.groups[group].weight / totalWeight;
			this.groups[group].max = p + chance;
			p += chance;
		}
	}

	calcTotalWeight(){
		let totalWeight = 0;
		for (let group in this.groups){
			totalWeight += this.groups[group].weight || 0;
		}
		return totalWeight;
	}

	assignGroups(){
		for (let customer of this.customers){
			let roll = Math.random();

			for (let key in this.groups){
				let group = this.groups[key];
				if (roll >= group.min && group.max >= roll){
					customer.assignFeatureGroup(group);
				}
			}
		}
		
		
	}

}


class Customer {
	constructor(name, featureGroup={}){
		this.name = name;
		this.featureGroup = featureGroup;
	}

	assignFeatureGroup(featureGroup){
		this.featureGroup = featureGroup;
	}

	hasFeature(feature){
		for (let key in this.featureGroup.features){
			if (key === feature){
				return true;
			}
		}
		return false;
	}
}


// alternative independent function for feature-checking
// just in case you're not into class methods...

function customerHasFeature(customer, feature){
	for (let featureName in customer.featureGroup.features){
		if (featureName === feature){
			return true
		}
	}
	return false;
}


// example data

const a = new Feature('A', {discount: 0.5}, "limes");
const b = new Feature('B');
const c = new Feature('C', [1, 2, 3, 4]);
const d = new Feature('D', 'limes');

const groupOne = new FeatureGroup('One', 7, a, b);
const groupTwo = new FeatureGroup('Two', 3, b, c);
const groupThree = new FeatureGroup('Three', 6, c);
const groupFour = new FeatureGroup('Four', 4, a, c, d);

const widgetCo = new Customer('Widget Co');
const synergy = new Customer('Synergy Inc');
const elevation = new Customer('Elevation Executives');
const momentum = new Customer('Momentum Partners');

const allCustomers = [widgetCo, synergy, elevation, momentum];

const recruitingMadness = new GroupAllocation(
						'Recruiting Madness',
						allCustomers,
						groupOne, groupTwo,
						groupThree, groupFour)


//assign features to customers

recruitingMadness.assignGroups();


// view results

console.log('\n This is the whole collection of feature groups: \n', recruitingMadness);
console.log('\n This is the customer synergy \n', synergy);
console.log('\n We check if they have feature B: ', synergy.hasFeature('B'));
console.log('\n Next we look at momentum \n', momentum);
console.log('\n And check if they have feature A: ', customerHasFeature(momentum, 'A'))

