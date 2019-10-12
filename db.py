from spyre import server
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

class SimpleApp(server.App):
	title = "Grotto Instagram Data"
	inputs = [{
		"type": "dropdown",
		"key": "metric",
		"label": "Select metric for image insights",
		'options':
		[{'label': 'engagement', 'value': 'engagement'},
		{'label': 'impressions', 'value': 'impressions'},
		{'label': 'reach', 'value': 'reach'},
		{'label': 'saved', 'value': 'saved'}],
		'value': 'engagement',
		"action_id": "button1"
	}]

	tabs = ['Table',
			'Plot'
	]

	outputs = [{
		'type': 'table',
		'id': 'table_id',
		'control_id': 'button1',
		'tab': 'Table'
	},
	{
		'type': 'plot',
		'id': 'plot_id',
		'control_id': 'button1',
		'tab': 'Plot'
	},
	{
		'type': 'download',
		'id': 'download',
		'control_id': 'button2',
		'on_page_load':  False
	}
	]

	controls = [{
		'type': 'hidden',
		'id': 'button1'
	},
	{
		'type': 'button',
		'id': 'button2',
		'label': 'download?'

	}

	]

	def getData(self, params):
		metric = params["metric"]
		df = pd.read_csv('image_insights.csv')
		return df#[['like_count', metric]]

	def getPlot(self, params):
		metric = params["metric"]
		df = self.getData(params)
		fig = plt.figure(figsize = (14,8))
		plt.plot(df.index, df['like_count'], label = 'like count')
		plt.plot(df.index, df[metric], label = metric)
		#plt.axvspan('6/1/2018','5/16/2019', color ='lightgrey', label = 'Start and end of boostio')
		plt.title(f'Image insights: like count and {metric}')
		plt.legend()
		return fig

app = SimpleApp()
app.launch()