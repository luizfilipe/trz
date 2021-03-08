# The Resident Zombie

## Instalation

1 - Install `nvm` from [here](https://github.com/nvm-sh/nvm)

2 - Run `nvm install`
    
3 - `npm install -g run-rs` to install mongodb database with replica-set

4 - `npm install`

5 - `npm run start` or `node @babel/register index.js`

## Endpoints

* The environment is configured to consider http://localhost:3006 running locally.

1 - GET /survivor - Gets all survivors that weren't infected

2 - GET /survivor/{id} - Gets a survivor by id

3 - POST /survivor - Sign up (create a survivor)
```
{
	"name": "Luiz Filipe",
	"age": 34,
	"gender": "male",
	"inventory": ["Fiji Water", "AK47", "First Aid Pouch", "Campbell Soup", "Campbell Soup"],
	"lastLocation": {
		"lat": 162.30,
		"long": 66.43
	}
}
```
4 - PUT or PATCH /survivor/{id}/location - Updates a survivor location
```
{
	"location": {
		"lat": 16.7,
		"long": 152.32 
	}
}
```
5 - PUT or PATCH /survivor/{id}/report - Report a infection (Called 5 times for a given survivor will mark him as infected)

6 - PUT or PATCH /survivor/trade - Trade resources between survivors
```
{ 
	"seller": {
		"id": "5e86182669216b8bb56f62a3",
		"items": [
			{"name": "Fiji Water", "amount": 1},
			{"name": "First Aid Pouch", "amount": 1}
		]
	},
	"buyer": {
		"id":"5e86185169216b8bb56f62a4",
		"items": [
			{"name": "Campbell Soup", "amount": 2}
		]
	}
} 
```
