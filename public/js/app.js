import { BrowserRouter } from 'react-router-dom';

alert(1)

const App = ()=>{
	return (
	<div>
		<Header/>
		
		<List/>
	</div>	
	);	
}

ReactDom.render(
	<App/>,
	document.getElementById('root')
)