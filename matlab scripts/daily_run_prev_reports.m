load_data_us;
data_4 = data_4(:, 1:151);  
deaths = deaths(:, 1:151);

load us_hyperparam_ref_64.mat
hyperparam_tuning;
death_hyperparams;
write_data_us;
write_unreported;