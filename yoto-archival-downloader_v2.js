
// function to convert seconds integer into human readable length
function convertSeconds(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours}h ${minutes}m ${remainingSeconds}s`;
}

// function to convert bytes data into human readable
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// First, find the script element by its ID
const scriptElement = document.getElementById('__NEXT_DATA__');

// Check if the element exists
if (scriptElement) {
    const undef = 'undefined'; // to use when a field is not present
	const jsonData = JSON.parse(scriptElement.textContent); // Parse the JSON content of the script element
	const card = jsonData.props.pageProps.card; // Navigate to the specific path where the card metadata is located
	const chapters = jsonData.props.pageProps.card.content.chapters; // Navigate to the specific path where trackUrl, title, and icon16x16 are located

    // Create a container for the links
		const container = document.createElement('div');
		container.style.margin = '20px';
		container.style.backgroundColor = 'rgba(244, 84, 54, .6)';
		container.style.padding = '20px';
		container.style.font = 'normal 10pt Source Sans Pro, Source Sans, Calibri, Arial, Tahoma';

    // Add a title to the container
		const containerTitle = document.createElement('h2');
		containerTitle.innerHTML += '<a href="https://github.com/humor4fun/yoto-archival-downloader">Archival Downloader for Yoto</a>';


    // Add an explanatory paragraph to the container
		const containerP = document.createElement('p');
		containerP.innerHTML += 'Need help? Click the title.<br /><br />';
	
	// Create a container for the Metadata
		const containerMeta = document.createElement('div');
		const containerTitleMeta = document.createElement('h3');
		containerTitleMeta.innerHTML += 'Archival Metadata';
		containerMeta.appendChild(containerTitleMeta);		

	// Get the important details that may not be defined, fallback on an undefined data so it doesn't look blank
		let category = (card.metadata.category) ? card.metadata.category : undef;
		let author = (card.metadata.author) ? card.metadata.author : undef;
		let slug = (card.slug) ? card.slug : undef;
		let languages = (card.metadata.languages) ? card.metadata.languages.toString() : undef;		
	
    // Write metadata to a text file, use ":: " as the key::value pair delimiter for safer parsing down the road. We don't want to just drop the entire json blob into the file because it may contain personal data.
		const textMeta = document.createElement('textarea');    
		textMeta.setAttribute("rows", "5");
		textMeta.setAttribute("cols", "50");
		textMeta.innerHTML += `Basic Details\n================\n`;
		textMeta.innerHTML += `Title:: ${card.title}\n`;
		textMeta.innerHTML += `Author:: ${author}\n`; // only exsists for official cards
		textMeta.innerHTML += `Description:: ${card.metadata.description}\n`;
		textMeta.innerHTML += `\n`;
		
		textMeta.innerHTML += `Extended Details\n================\n`;
		textMeta.innerHTML += `Version:: ${card.content.version}\n`;
		textMeta.innerHTML += `Category:: ${category}\n`; // only exsists for official cards
		textMeta.innerHTML += `Languages:: ${languages}\n`;	//This is an array, so it needs to be forced into a string.
		textMeta.innerHTML += `PlaybackType:: ${card.content.playbackType}\n`;
		textMeta.innerHTML += `CardID:: ${card.cardId}\n`;
		textMeta.innerHTML += `CreatedAt:: ${card.createdAt}\n`;
		textMeta.innerHTML += `UpdatedAt:: ${card.updatedAt}\n`;
		textMeta.innerHTML += `Slug:: ${slug}\n`;  // only exsists for official cards
		textMeta.innerHTML += `sortkey:: ${card.sortkey}\n`;	
		textMeta.innerHTML += `Duration:: ${card.metadata.media.duration}\n`;
		textMeta.innerHTML += `ReadableDuration:: ${convertSeconds(card.metadata.media.duration)}\n`; // not always available, so let's just calculate it to be easier
		textMeta.innerHTML += `FileSize:: ${card.metadata.media.fileSize}\n`;
		textMeta.innerHTML += `ReadableFileSize:: ${formatBytes(card.metadata.media.fileSize)}\n`; // not always available, so let's just calculate it to be easier
		textMeta.innerHTML += `Note:: ${card.metadata.note}\n`;
		textMeta.innerHTML += `\n`;
	    
	// These fields only exist in MYO cards
		textMeta.innerHTML += `\n`;
		textMeta.innerHTML += `Share Statistics\n================\n`;
		textMeta.innerHTML += `ShareCount:: ${card.shareCount}\n`;
		textMeta.innerHTML += `Availability:: ${card.availability}\n`;
		textMeta.innerHTML += `ShareLinkUrl:: ${card.shareLinkUrl}\n`;    
		textMeta.innerHTML += `\n`;
		
		textMeta.innerHTML += `Track Details\n================\n`;    
		// metadata continues after the tracks are looped to include track details

	// Build the main content table
		const contentTable = document.createElement('table');
		contentTable.style.border = '0px';
		contentTable.style.borderSpacing = '0px';
		contentTable.style.backgroundColor = '#cfcfcf';

		var tblHeader = document.createElement('tr');
		tblHeader.style.color = '#ffffff';
		tblHeader.style.backgroundColor = '#336699';
		tblHeader.innerHTML = "<th style='border: 0px;'>&nbsp;</th><th style='border: 0px; text-align: center;'>Track #</th><th style='border: 0px; text-align: left;'>Track Title</th><th style='border: 0px;'>Track Link</th><th style='border: 0px;'>Icon Link</th>";

		contentTable.appendChild(tblHeader);

		// Initialize track and image numbers
		let trackNumber = 1;

		// Loop through chapters and tracks to create links
		chapters.forEach(chapter => {
			chapter.tracks.forEach(track => {
				let trackPath = (track.trackUrl) ? track.trackUrl : "";
				let imagePath = (chapter.display && chapter.display.icon16x16) ? chapter.display.icon16x16 : "";
				const trackPad = trackNumber.toString().padStart(3, '0');
				
					// Add the track info into the metadata file
				textMeta.innerHTML += `TrackNumber:: ${trackPad}\n`;
				textMeta.innerHTML += `Title:: ${track.title}\n`;
				textMeta.innerHTML += `Format:: ${track.format}\n`;
				textMeta.innerHTML += `Type:: ${track.type}\n`;
				textMeta.innerHTML += `Duration (Seconds):: ${track.duration}\n`;
				textMeta.innerHTML += `ReadableDuration:: ${convertSeconds(track.duration)}\n`; 
				textMeta.innerHTML += `FileSize:: ${track.fileSize}\n`;
				textMeta.innerHTML += `ReadableFileSize:: ${formatBytes(track.fileSize)}\n`;
				textMeta.innerHTML += `Channels:: ${track.channels}\n`;
				textMeta.innerHTML += `\n`;

				let tblCells = "";
				tblCells += "<td style='border: 1px solid white; text-align: center'>" + ((imagePath != "") ? "<img src='" + imagePath + "' style='border: 0px;' />" : "") + "</td>";
				tblCells += "<td style='border: 1px solid white; text-align: center'>" + trackNumber.toString().padStart(3,'0') + "</td><td style='border: 1px solid white; width: 400px;'>" + track.title + "</td>";
				tblCells += "<td style='border: 1px solid white; text-align: center'>" + ((trackPath != "") ? "[<a href='" + trackPath + "' title='" + card.title + " = " + trackPad + " - " + track.title + "' target='_blank'>Get</a>]" : "") + "</td>";
				tblCells += "<td style='border: 1px solid white; text-align: center'>" + ((imagePath != "") ? "[<a href='" + imagePath + "' title='" + card.title + " = " + trackPad + " - " + track.title + "' target='_blank'>Get</a>]" : "") + "</td>";

				var tblRow = document.createElement('tr');
				tblRow.innerHTML = tblCells;

				// Append the track line to the container
				contentTable.appendChild(tblRow);

				// Increment track number
				trackNumber++;
			});
		});

    //Make the metadata content into a downloadable text file
	// TODO: it would be good to put a button next to the textarea that copies the contents to clipboard if we can't set it to be downloadable.
		const metaRawText = textMeta.value; //get content of the text area
		const blob = new Blob([metaRawText], {type: 'text/plain'}); //create a blob with the content
		const metaLink = document.createElement('a'); //create a link element
		metaLink.href = window.URL.createObjectURL(blob); //create a url for the blob and set it to the href attribute
		metaLink.download = `${card.title}.txt`; // set the download attribute with a filename
		metaLink.textContent = `[Get Metadata]`; // give the link a text that matches the other listed items
		containerMeta.appendChild(metaLink); // append the metadata download link to the container
		containerMeta.appendChild(document.createElement('p'));
		containerMeta.appendChild(textMeta); //append the textarea to the container for debug/inspect uses	
		

	 // Rebuild the card artwork, title, and author section
		const cardInfoHeader = document.createElement('p');

		var cardInfoHeaderHtml = '<span style="font-weight: bold; font-size: 13pt;">' + card.title;
		cardInfoHeaderHtml += ' (by ' + author + ')';
		cardInfoHeaderHtml += '</span>';

		cardInfoHeaderHtml = '<img src="' + card.metadata.cover.imageL + '" style="float: left; height: 150px; border: 0; margin: 0px 20px 20px 0px;" />' + cardInfoHeaderHtml;
		cardInfoHeaderHtml += '<br /><a href="' + card.metadata.cover.imageL + '" title="' + card.title + ' - Artwork">[ Get Artwork ]</a>';
		cardInfoHeaderHtml += '<div style="clear: both"></div>';
		cardInfoHeader.innerHTML += cardInfoHeaderHtml;
	
	//build the new layout
	container.appendChild(containerTitle);
	container.appendChild(containerP);
	container.appendChild(cardInfoHeader);
	container.appendChild(containerMeta);
	container.appendChild(contentTable);

    // Let's remove the player controls div to clean up the page and simplify the Mass Downloader process
    const playerControlsDiv = document.getElementsByClassName("player-controls")[0];
    if (playerControlsDiv) { playerControlsDiv.innerHTML = "<br /><br />"; }

    // Let's remove the footer div to clean up the page and simplify the Mass Downloader process
    const footerDiv = document.getElementsByClassName("Footer_appDownloadBar__g7nY9")[0];
    if (footerDiv) { footerDiv.remove(); }

    // Insert the container at the top of the body of the page
    document.body.insertBefore(container, document.body.firstChild);
} else {
    console.error('Playlist Data Not Found');
}
