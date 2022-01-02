var params = {
	"file": "strategy.pine",
	"name": "Trailing SL Template",
	"inputs": [
		{
			"name": "tsl_perc",
			"min": 0.01,
			"max": 0.99,
			"step": 0.01
		},
		{
			"name": "sma_len",
			"min": 1,
			"max": 50,
			"step": 1
		},
		{
			"name": "roc_len",
			"min": 1,
			"max": 50,
			"step": 1
		},
		{
			"name": "sma_min",
			"min": 1,
			"max": 10,
			"step": 1
		},
		{
			"name": "roc_min",
			"min": 1,
			"max": 10,
			"step": 1
		}

	]
}

export { params }