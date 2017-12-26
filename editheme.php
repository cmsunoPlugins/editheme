<?php
session_start(); 
if(!isset($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH'])!='xmlhttprequest') {sleep(2);exit;} // ajax request
if(!isset($_POST['unox']) || $_POST['unox']!=$_SESSION['unox']) {sleep(2);exit;} // appel depuis uno.php
?>
<?php
include('../../config.php');
include('lang/lang.php');
$q = file_get_contents('../../data/busy.json'); $a = json_decode($q,true); $Ubusy = $a['nom'];
$q = file_get_contents('../../data/'.$Ubusy.'/site.json'); $a = json_decode($q,true); $tem = $a['tem'];
// ********************* actions *************************************************************************
if (isset($_POST['action']))
	{
	switch ($_POST['action'])
		{
		// ********************************************************************************************
		case 'plugin': ?>
		<link rel="stylesheet" href="uno/plugins/editheme/codemirror/codemirror.css">
		<link rel="stylesheet" href="uno/plugins/editheme/codemirror/base16-dark.css">
		<div class="blocForm">
			<h2><?php echo T_("Edit Theme");?></h2>
			<p><?php echo T_("This plugin allows you to edit the templates.");?></p>
			<p><?php echo T_("The Files started with '_0' are a copy of the original. You cannot remove the original.");?></p>
			<div>
				<label style="margin:0 10px"><?php echo T_("File");?></label>
				<select id="edithemeSel" name="edithemeSel">
				<?php
				$d = dirname(__FILE__).'/../../template/'.$tem.'/';
				if($dh=opendir($d))
					{
					$a = array();
					while(($file = readdir($dh))!==false)
						{
						if(is_file($d.$file) && $file!='.' && $file!='..') $a[] = $file;
						}
					closedir($dh);
					sort($a);
					foreach($a as $v) echo '<option value="'.$v.'">'.$v.'</option>';
					}
				?>
				</select>
				<input type="hidden" name="edithemeFile" id="edithemeFile" value="" />
				<div class="bouton" style="margin:0 20px;" onClick="f_sel_editheme(document.getElementById('edithemeSel'));" title="<?php echo T_("Edit");?>"><?php echo T_("Edit");?></div>
			</div>
			<div class="clear" style="margin-top:10px"></div>
			<textarea id="code" name="code" style="display:none;"></textarea>
			<div style="margin-top:10px;"></div>
			<div id="edithemeBtn" style="display:none;">
				<div class="bouton fl" onClick="f_restore_editheme();" title="<?php echo T_("Restore original");?>"><?php echo T_("Restore original");?></div>
				<div class="bouton fr" onClick="f_save_editheme();" title="<?php echo T_("Save");?>"><?php echo T_("Save");?></div>
			</div>
			<div class="clear"></div>
		</div>
		<?php break;
		// ********************************************************************************************
		case 'getFile':
		$q = file_get_contents('../../template/'.$tem.'/'.$_POST['file']);
		echo $q;
		break;
		// ********************************************************************************************
		case 'save':
		$f = $_POST['file'];
		$out = $_POST['cont'];
		if(substr($f,0,2)!='_0')
			{
			if(!file_exists('../../template/'.$tem.'/_0'.$f)) copy('../../template/'.$tem.'/'.$f, '../../template/'.$tem.'/_0'.$f);
			if(file_put_contents('../../template/'.$tem.'/'.$f, $out))
				{
				echo T_('Backup performed');
				exit;
				}
			}
		echo '!'.T_('Impossible backup');
		break;
		// ********************************************************************************************
		case 'restore':
		$f = $_POST['file']; $b = 0;
		if(substr($f,0,2)!='_0' && file_exists('../../template/'.$tem.'/_0'.$f))
			{
			unlink('../../template/'.$tem.'/'.$f);
			rename('../../template/'.$tem.'/_0'.$f, '../../template/'.$tem.'/'.$f);
			$b = 1;
			}
		else if(substr($f,0,2)=='_0')
			{
			if(file_exists('../../template/'.$tem.'/'.substr($f,2))) unlink('../../template/'.$tem.'/'.substr($f,2));
			rename('../../template/'.$tem.'/'.$f, '../../template/'.$tem.'/'.substr($f,2));
			$b = 1;
			}
		if($b) echo T_('Backup performed');
		else echo '!'.T_('Impossible backup');
		break;
		// ********************************************************************************************
		}
	clearstatcache();
	exit;
	}
?>
