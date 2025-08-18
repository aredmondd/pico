<script lang="ts">
	// TODO:
	// Figure out how to dynamically input commas
	// else if (i > 2 && i % 3 == 0 && array.length > 5) {
	//     formattedValue += ',';
	// }

	let value: string = $state('$0.00');
	let array: string[] = $state([]);

	function handleAmountInput(event: Event) {
		let formattedValue: string = '';

		if (event.inputType === 'deleteContentBackward') {
			if (array.length <= 1) {
				formattedValue = '$0.00';
				document.getElementById('amountInput').value = formattedValue;
				return;
			} else {
				array.pop();
			}
		} else {
			array.push(value.substring(value.length - 1, value.length));
		}

		if (array.length == 1) {
			formattedValue = `$0.0${array[array.length - 1]}`;
		} else if (array.length == 2) {
			formattedValue = `$0.${array[array.length - 2]}${array[array.length - 1]}`;
		} else if (array.length == 3) {
			formattedValue = `$${array[array.length - 3]}.${array[array.length - 2]}${array[array.length - 1]}`;
		}
		// anything larger than $9.99
		else {
			formattedValue += '$';
			for (let i = 0; i < array.length; i++) {
				if (i === array.length - 2) {
					formattedValue += '.';
				}
				formattedValue += array[i];
			}
		}
		// update the value to be the formatted string
		document.getElementById('amountInput').value = formattedValue;
	}
</script>

<input id="amountInput" bind:value oninput={handleAmountInput} class="bg-silver text-gunmetal" />
