define([
	'dojo/_base/declare', 
	'saga/widgets/mobile/TableViewController',
	'./RevealRearTableViewHeader', 
	'./RevealRearTableViewCell',
	'./RevealRearTableViewUserCell',
	'dojo/dom-class',  
	'dojo/on',
	'saga/utils/Utils'], 
	
	function(declare, TableViewController, RevealRearTableViewHeader, RevealRearTableViewCell, RevealRearTableViewUserCell, domClass, on, Utils) {
	
	return declare('saga.RevealRearTableViewController', [TableViewController], {
			
		revealViewController: null,
				
		data: null,	
				
		constructor: function(args){

		},
		
		postCreate: function() {
			this.inherited(arguments);
			domClass.add(this.domNode, "leftReveal-container");
			this.revealViewController.setRevealRearViewController(this);
		},
		
		
		viewForHeaderInSection: function(section) {
			var info = this.infoForHeaderInSection(section);
			var rrtvh = null;
			if(info && info.label)
				rrtvh = new RevealRearTableViewHeader(info);
			return rrtvh;
		},
		
		infoForHeaderInSection: function(section) {
			//{label:""} To be implemented by subclass
		},
		
		cellForRowAtIndexPath: function(indexPath) {
			/*var row = this.data[indexPath.section].rows[indexPath.row];
			var rrtvc;
			if(indexPath.section==0)
				rrtvc = new RevealRearTableViewUserCell({label:row.label});
			else{
				rrtvc = new RevealRearTableViewCell(row);
				//rrtvc.setNumberNewItems(row.numberNewItems);
				var svgSupport = Utils.svgSupport();
				if(indexPath.section==1){
					if(row.type){
						rrtvc.imgNode.src = svgSupport?"app/resources/img/i4.svg":"app/resources/img/i4.png";
					}
					else{
						if(row.logo)
							rrtvc.imgNode.src = localStorage.serverPath+row.logo.path;
						else
							rrtvc.imgNode.src = svgSupport?"app/resources/img/intraprise-grey.svg":"app/resources/img/intraprise-grey.png";
					}
				}
				if(indexPath.section==2){
					if(indexPath.row == 0)
						rrtvc.imgNode.src = svgSupport?"app/resources/img/users.svg":"app/resources/img/users.png";
					if(indexPath.row == 1)
						rrtvc.imgNode.src = svgSupport?"app/resources/img/intraprises-users.svg":"app/resources/img/intraprises-users.png";
					if(indexPath.row == 2)
						rrtvc.imgNode.src = svgSupport?"app/resources/img/inbox.svg":"app/resources/img/inbox.png";
					if(indexPath.row == 3)
						rrtvc.imgNode.src = svgSupport?"app/resources/img/info-reveal.svg":"app/resources/img/info-reveal.png";
					if(indexPath.row == 4)
						rrtvc.imgNode.src = svgSupport?"app/resources/img/logout.svg":"app/resources/img/logout.png";
				}
			}
			return rrtvc;*/
			var info = this.infoForRowAtIndexPath(indexPath);
			if(info.kind == "User")
				var rrtvc = new RevealRearTableViewUserCell(info);
			else
				var rrtvc = new RevealRearTableViewCell(info);
			return rrtvc;
		},
		
		infoForRowAtIndexPath: function(indexPath){
			//{kind:"", label:"", imgSrc:"", notification:""}To be implemented by subclass
		},
		
		didSelectRowAtIndexPath: function(indexPath) {
			this.selectCell(this.existingCellForRowAtIndexPath(indexPath));
			/*var vcToPush = null; 
			var frame = Window.getFrame();
			frame.height -= 44;

			if(indexPath.section == 0){
				vcToPush = new UserViewController({frame:frame});
			}
			
			if (indexPath.section ==1) {
				vcToPush = new ThreadsListViewController({parent:this, frame:frame, group:this.data[indexPath.section].rows[indexPath.row]});
			}
			
			if (indexPath.section == 2) {

				if (this.data[indexPath.section].rows[indexPath.row].kind ==  "logout") {
					UserStore.singleton().logout();
				}
				
				if (indexPath.row == 0) 
					vcToPush = new DirectoryViewController({frame:frame, kind:"User", deferred:UserStore.singleton().getUsers()});
					
				if (indexPath.row == 1) 
					vcToPush = new DirectoryViewController({frame:frame, kind:"Intraprise", deferred:IntrapriseStore.singleton().getIntraprises()});
				
				//if (indexPath.row == 2) 
					//vcToPush = new SettingsViewController({frame:frame});

				if (indexPath.row == 2)
					vcToPush = new InboxViewController({frame:frame});

				if (indexPath.row == 3)
					vcToPush = new DisclaimerViewController({frame:frame});

				if (indexPath.row == 4){
					localStorage.removeItem("username");
					localStorage.removeItem("password");
					localStorage.removeItem("token");
					Window.reload();
				}
					
				
			}
			if(vcToPush)
				this.showViewControllerOnTop(vcToPush);*/

		},

		/*showViewControllerOnTop:function(viewController){

			var revealViewController = this.revealViewController;
			revealViewController.setViewController(viewController);
			revealViewController.revealStart();
		},*/

		selectCell: function(cell) {
			var revealViewController = this.revealViewController;
			domClass.add(cell.domNode, "selected");
			on(revealViewController, "revealEnd", function(args){
				if(cell.domNode)
					domClass.remove(cell.domNode, "selected");	
			});
		}

	});
});
