
// Back-end for blockdozer.com API

var backend =
{
	host:      'blockdozer.com',
	home_page: 'http://blockdozer.com/',
	adr_page:  'http://blockdozer.com/insight/address/',
	tx_page:   'http://blockdozer.com/insight/tx/'
};//___________________________________________________________________________

function backend_balance_cb(data)
{
	console.log(data);

	try{ data = JSON.parse(data); } catch(e){ data = {}; }

	this.balance_cb(parseFloat(data.balance) + parseFloat(data.unconfirmedBalance));
}//____________________________________________________________________________

function backend_unspent_cb(data)
{
	var utxo = false; console.log(data);

	try{ data = JSON.parse(data); } catch(e){ data = {}; }

	if(data.length)
	{
		utxo = [];

		for(var i = 0; i < data.length; i++)
		{
			var u = data[i];

			utxo.push({txid: u.txid, n: u.vout, amount: u.satoshis, script: u.scriptPubKey});
		}
	}

	backend.unspent_cb(utxo);
}//____________________________________________________________________________

function backend_send_cb(data)
{
	console.log(data);

	var res = '';

	try{ data = JSON.parse(data); res = data.responseText; } catch(e){ data = {}; }

	backend.send_cb(data.txid ? '' : data);
}//____________________________________________________________________________

backend.get_balance = function(adr, cb)
{
	this.balance_cb = cb;

	js.ajax('GET', 'http://blockdozer.com/insight-api/addr/' + adr, '', backend_balance_cb);
};//___________________________________________________________________________

backend.get_utxo = function(adr, cb)
{
	this.unspent_cb = cb;

	js.ajax('GET', 'http://blockdozer.com/insight-api/addr/' + adr + '/utxo', '', backend_unspent_cb);
};//___________________________________________________________________________

backend.send = function(tx, cb)
{
	this.send_cb = cb;

	js.ajax('POST', 'http://blockdozer.com/insight-api/tx/send', 'rawtx=' + tx, backend_send_cb);
};//___________________________________________________________________________
