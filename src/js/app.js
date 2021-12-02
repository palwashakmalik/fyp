App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../raw.json', function(data) {
      var ProductRow = $('#productRow');
      var ProductTemplate = $('#productTemplate');

      for (i = 0; i < data.length; i ++) {
        ProductTemplate.find('.panel-title').text(data[i].Productname);
        ProductTemplate.find('img').attr('src', data[i].picture); 
        ProductTemplate.find('.Productprice').text(data[i].Productprice);
        ProductTemplate.find('.Productcompany').text(data[i].Productcompany);
        ProductTemplate.find('.productlocation').text(data[i].Productlocation);
        ProductTemplate.find('.productdeltime').text(data[i].Productdeltime);
        ProductTemplate.find('.btn-productbuy').attr('data-id', data[i].id);

        ProductRow.append(ProductTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    
if (window.ethereum) {
  App.web3Provider = window.ethereum;
  try {
    // Request account access
    await window.ethereum.request({ method: "eth_requestAccounts" });;
  } catch (error) {
    // User denied account access...
    console.error("User denied account access")
  }
}
// Legacy dapp browsers...
else if (window.web3) {
  App.web3Provider = window.web3.currentProvider;
}
// If no injected web3 instance is detected, fall back to Ganache
else {
  App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
}
web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('raw.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with @truffle/contract
      var rawArtifact = data;
      App.contracts.Drugpurchase  = TruffleContract(rawArtifact);
    
      // Set the provider for our contract
      App.contracts.Drugpurchase.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the adopted pets
      return App.markAdopted();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-productbuy', App.handleProductbuy);
  },

  markAdopted: function() {
    var adoptionInstance;

    App.contracts.Drugpurchase.deployed().then(function(instance) {
       adoptionInstance = instance;
    
      return adoptionInstance.getdrugbuyers.call();
    }).then(function(adopters) {
      for (i = 0; i < adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleProductbuy: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

web3.eth.getAccounts(function(error, accounts) {
  if (error) {
    console.log(error);
  }

  var account = accounts[0];

  App.contracts.Drugpurchase.deployed().then(function(instance) {
    adoptionInstance = instance;

    // Execute adopt as a transaction by sending account
    return adoptionInstance.buydrug(Id, {from: account});
  }).then(function(result) {
    return App.markAdopted();
  }).catch(function(err) {
    console.log(err.message);
  });
});
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
