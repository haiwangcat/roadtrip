

$("#add-to-trip-button").click(function(){
	//$(".add-to-trip-button").click(function(){
		var Item ={
				name: ''
				//lat: parseFloate(selectedItemGPS[0]),
				//lng: parseFloate(selectedItemGPS[1]),
				}; 
		Item.name = selectedItemName;
		console.log('item.name',Item.name);
		selectedItem.push(Item.name);
			$('#item-name').append('->');
			$('#item-name').append(Item.name);
		
	//});
});

console.log('item',selectedItem);

		
			
			